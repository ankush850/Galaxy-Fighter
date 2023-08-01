local composer = require('composer')
local cena = composer.newScene()

function cena:create( event )
	local cenaJogo = self.view

	local x = display.contentWidth
	local y = display.contentHeight
	local t = (x + y) / 2

	-- Audio
	local somTiro = audio.loadSound('recursos/audio/tiro.mp3')
	local somMorte = audio.loadSound('recursos/audio/morte.mp3')
	local somClick = audio.loadSound('recursos/audio/click.mp3')
	local somTransicao = audio.loadSound('recursos/audio/transicao.mp3')
	local musicaJogo = audio.loadStream('recursos/audio/musica.mp3')

	if musicaJogo then
		audio.play(musicaJogo, { loops = -1, channel = 1 })
	end

	-- DECLARACAO DOS GRUPOS DA CENA
	local grupoFundo = display.newGroup()
	local grupoJogo = display.newGroup()
	local GUI = display.newGroup()

	cenaJogo:insert( grupoFundo )
	cenaJogo:insert( grupoJogo )
	cenaJogo:insert( GUI )

	-- DECLARACAO DAS VARIAVEIS
	local vida = 3
	local municao = 3
	local pente = 3
	local moedas = 0
	local vivo = true
	local pause = false
	local moverCima = false
	local moverBaixo = false
	local velocidadeAviao = 5
	local danoAviao = 1
	local kill = 0
	local bossAtivo = false
	local timerInimigo = nil
	local timerBossAtaque = nil
	local timerBossMovimento = nil

	-- DECLARAÇÃO DE FISICA
	local physics = require('physics')
	physics.start()
	physics.setGravity(0, 0)
	physics.setDrawMode( 'normal' )

	-- DELCARACAO DOS OBJETOS DE EXIBIÇAO
	local fundo = display.newImageRect( grupoFundo, 'recursos/imagens/BG/sky_background_mountains.png', x, y)
	fundo.x = x * 0.5
	fundo.y = y * 0.5

	local fundo2 = display.newImageRect( grupoFundo, 'recursos/imagens/BG/sky_background_mountains.png', x, y)
	fundo2.x = x * 1.5
	fundo2.y = y * 0.5

	local function gerarFundo()
		if not vivo then return end
		fundo.x = fundo.x - 2
		fundo2.x = fundo2.x - 2

		if (fundo.x <= -x * 0.5) then
			fundo.x = x * 1.5
		elseif (fundo2.x <= -x * 0.5) then
			fundo2.x = x * 1.5
		end
	end
	Runtime:addEventListener('enterFrame', gerarFundo)

	local aviao = display.newImageRect( grupoJogo, 'recursos/imagens/planes/plane_1/plane_1_red.png', x*0.13, y*0.13 )
	aviao.x = x * 0.23
	aviao.y = y * 0.5
	physics.addBody( aviao, 'dynamic', { isSensor = true } )
	aviao.id = 'aviaoID'

	-- BOSS FORWARD DECLARATION
	local criaBoss

	-- INIMIGO
	local function criaInimigo()
		if (vivo == true and not bossAtivo) then
			local inimigo = display.newImageRect(grupoJogo, 'recursos/imagens/planes/inimigos/ovni.png', x*0.13, y*0.13)
			inimigo.x = x * 0.95
			inimigo.y = math.random(y * 0.17, y * 0.93)
			physics.addBody(inimigo, 'dynamic', { isSensor = true })
			inimigo.id = 'inimigoID'
			inimigo.vida = 3

			transition.to( inimigo, {
				time = 8000,
				x = -x * 0.5,
				onComplete = function(selfObj)
					display.remove(selfObj)
				end
			})
		end
	end
	timerInimigo = timer.performWithDelay(3500, criaInimigo, 0)

	-- CONTROLES UI
	local botaoCima = display.newImageRect(GUI, 'recursos/imagens/UI/botao_cima.png', t*0.08, t*0.08)
	botaoCima.x = x * 0.12
	botaoCima.y = y * 0.7

	local botaoBaixo = display.newImageRect(GUI, 'recursos/imagens/UI/botao_cima.png', t*0.08, t*0.08)
	botaoBaixo.x = x * 0.12
	botaoBaixo.y = y * 0.9
	botaoBaixo.rotation = -180

	local botao3 = display.newImageRect( GUI, 'recursos/imagens/UI/Button - PS Circle 2.png', t*0.12, t*0.12)
	botao3.x = x * 0.87
	botao3.y = y * 0.8
	botao3.alpha = 0.7

	local botao4 = display.newImageRect( GUI, 'recursos/imagens/UI/Button - PS Cross 2.png', t*0.12, t*0.12)
	botao4.x = x * 0.8
	botao4.y = y * 0.9
	botao4.alpha = 0.7

	local iconeVida1 = display.newImageRect(GUI, 'recursos/imagens/UI/life.png', t*0.06, t*0.06)
	iconeVida1.x = x * 0.07
	iconeVida1.y = y * 0.1

	local iconeVida2 = display.newImageRect(GUI, 'recursos/imagens/UI/life.png', t*0.06, t*0.06)
	iconeVida2.x = x * 0.12
	iconeVida2.y = y * 0.1

	local iconeVida3 = display.newImageRect(GUI, 'recursos/imagens/UI/life.png', t*0.06, t*0.06)
	iconeVida3.x = x * 0.17
	iconeVida3.y = y * 0.1

	local iconeMunicao1 = display.newImageRect(GUI, 'recursos/imagens/UI/municao.png', t*0.06, t*0.06)
	iconeMunicao1.x = x * 0.07
	iconeMunicao1.y = y * 0.22

	local iconeMunicao2 = display.newImageRect(GUI, 'recursos/imagens/UI/municao.png', t*0.06, t*0.06)
	iconeMunicao2.x = x * 0.12
	iconeMunicao2.y = y * 0.22

	local iconeMunicao3 = display.newImageRect(GUI, 'recursos/imagens/UI/municao.png', t*0.06, t*0.06)
	iconeMunicao3.x = x * 0.17
	iconeMunicao3.y = y * 0.22

	local iconeMoeda = display.newImageRect(GUI, 'recursos/imagens/icones/gold_coin.png', t*0.06, t*0.06)
	iconeMoeda.x = x * 0.45
	iconeMoeda.y = y * 0.1

	local textoMoeda = display.newText(GUI, moedas, x * 0.52, y * 0.1, nil, t*0.065)
	textoMoeda:setFillColor(1, 1, 1)

	-- MOVIMENTO
	local function moverAviao()
		if not vivo then return end
		if moverCima and aviao.y > y * 0.17 then
			aviao.y = aviao.y - velocidadeAviao
		end
		if moverBaixo and aviao.y < y * 0.93 then
			aviao.y = aviao.y + velocidadeAviao
		end
	end
	Runtime:addEventListener( 'enterFrame', moverAviao )

	local function verificaCima( event )
		if (event.phase == 'began') then
			moverCima = true
		elseif (event.phase == 'ended' or event.phase == 'cancelled') then
			moverCima = false
		end
		return true
	end
	botaoCima:addEventListener( 'touch', verificaCima )

	local function verificaBaixo( event )
		if (event.phase == 'began') then
			moverBaixo = true
		elseif (event.phase == 'ended' or event.phase == 'cancelled') then
			moverBaixo = false
		end
		return true
	end
	botaoBaixo:addEventListener( 'touch', verificaBaixo )

	-- ACOES
	local function atirar( event )
		if (event == nil or event.phase == 'began') then
			if (vivo and municao > 0) then
				local tiro = display.newImageRect(grupoJogo, 'recursos/imagens/planes/tiros/torpedo_flame.png', t*0.07, t*0.025 )
				tiro.x = aviao.x + 30
				tiro.y = aviao.y
				physics.addBody(tiro, 'dynamic', { isSensor = true })
				tiro.id = 'tiroID'

				if somTiro then audio.play(somTiro) end

				transition.to(tiro, {
					time = 1800,
					x = x * 1.5,
					onComplete = function(selfObj) display.remove(selfObj) end
				})

				municao = municao - 1
			end
		end
		return true
	end
	botao4:addEventListener( 'touch', atirar )

	local function reload( event )
		if (event == nil or event.phase == 'began') then
			if (vivo and municao < pente) then
				municao = pente
				if somClick then audio.play(somClick) end
			end
		end
		return true
	end
	botao3:addEventListener( 'touch', reload )

	-- TECLADO (WASD / Arrows / Space / R)
	local function onKeyEvent( event )
		if not vivo then return false end
		local keyName = event.keyName
		local phase = event.phase

		if keyName == 'up' or keyName == 'w' then
			moverCima = (phase == 'down')
		elseif keyName == 'down' or keyName == 's' then
			moverBaixo = (phase == 'down')
		elseif (keyName == 'space' or keyName == 'x' or keyName == 'j') and phase == 'down' then
			atirar(nil)
		elseif (keyName == 'r' or keyName == 'c' or keyName == 'k') and phase == 'down' then
			reload(nil)
		end
		return false
	end
	Runtime:addEventListener('key', onKeyEvent)

	-- VERIFICA MUNICAO
	local function verificaMunicao()
		iconeMunicao1.alpha = (municao >= 1) and 1 or 0
		iconeMunicao2.alpha = (municao >= 2) and 1 or 0
		iconeMunicao3.alpha = (municao >= 3) and 1 or 0
	end
	Runtime:addEventListener('enterFrame', verificaMunicao)

	-- GAME OVER
	local function gameOver(vitoria)
		vivo = false
		if timerInimigo then timer.cancel(timerInimigo) end
		if timerBossAtaque then timer.cancel(timerBossAtaque) end
		if timerBossMovimento then timer.cancel(timerBossMovimento) end

		if somMorte then audio.play(somMorte) end

		local telaFim = display.newRect( GUI, x*0.5, y*0.5, x, y)
		telaFim:setFillColor( 0, 0, 0, 0.7 )

		local msg = vitoria and "VITÓRIA!" or "VOCÊ PERDEU!"
		local cor = vitoria and {0.2, 0.9, 0.3} or {0.9, 0.2, 0.2}
		local textoFim = display.newText( GUI, msg, x*0.5, y*0.4, nil, t*0.08 )
		textoFim:setFillColor( unpack(cor) )

		local textoScore = display.newText( GUI, "Moedas: " .. moedas .. " | Kills: " .. kill, x*0.5, y*0.55, nil, t*0.045 )

		local btnRestart = display.newText( GUI, "Toque para Reiniciar", x*0.5, y*0.7, nil, t*0.05 )
		btnRestart:setFillColor( 1, 1, 0 )

		local function reiniciarJogo(e)
			if e.phase == 'began' then
				Runtime:removeEventListener('touch', reiniciarJogo)
				composer.removeScene('cenas.jogo')
				composer.gotoScene('cenas.iniciar', { time = 300, effect = 'fade' })
			end
		end
		timer.performWithDelay(500, function()
			Runtime:addEventListener('touch', reiniciarJogo)
		end)
	end

	-- VERIFICA VIDA
	local function verificaVida()
		iconeVida1.alpha = (vida >= 1) and 1 or 0
		iconeVida2.alpha = (vida >= 2) and 1 or 0
		iconeVida3.alpha = (vida >= 3) and 1 or 0

		if (vida <= 0 and vivo) then
			display.remove(aviao)
			gameOver(false)
		end
	end
	Runtime:addEventListener('enterFrame', verificaVida)

	-- BOSS CREATION
	criaBoss = function()
		if bossAtivo then return end
		bossAtivo = true

		if timerInimigo then timer.cancel(timerInimigo) end

		local boss = display.newImageRect( grupoJogo, 'recursos/imagens/planes/inimigos/boss.png', x*0.35, y*0.42 )
		boss.x = x * 0.75
		boss.y = y * 0.5
		boss.vida = 25
		physics.addBody(boss, 'dynamic', { isSensor = true })
		boss.id = 'bossID'

		local function moveBoss()
			if not vivo or not boss.y then return end
			transition.to(boss, {
				time = 1500,
				y = math.random(y * 0.25, y * 0.85)
			})
		end
		timerBossMovimento = timer.performWithDelay( 2500, moveBoss, 0)

		-- Boss Shooting
		local function bossAtira()
			if not vivo or not boss.x or not boss.y then return end
			local bossTiro = display.newImageRect(grupoJogo, 'recursos/imagens/planes/tiros/fire_ball_1.png', t*0.06, t*0.035)
			bossTiro.x = boss.x - 40
			bossTiro.y = boss.y
			physics.addBody(bossTiro, 'dynamic', { isSensor = true })
			bossTiro.id = 'bossTiroID'

			transition.to(bossTiro, {
				time = 3000,
				x = -x * 0.2,
				onComplete = function(selfObj) display.remove(selfObj) end
			})
		end
		timerBossAtaque = timer.performWithDelay( 2200, bossAtira, 0 )
	end

	-- COLISOES
	local function verificaColisao( event )
		if (event.phase == 'began' and vivo) then
			local obj1 = event.object1
			local obj2 = event.object2

			if not (obj1 and obj2 and obj1.id and obj2.id) then return end

			-- TIRO E INIMIGO
			if ((obj1.id == 'inimigoID' and obj2.id == 'tiroID') or (obj2.id == 'inimigoID' and obj1.id == 'tiroID')) then
				local tiro = (obj1.id == 'tiroID') and obj1 or obj2
				local inimigo = (obj1.id == 'inimigoID') and obj1 or obj2

				display.remove(tiro)
				inimigo.vida = inimigo.vida - danoAviao

				transition.blink(inimigo, {time = 200})
				timer.performWithDelay(250, function()
					if inimigo and inimigo.alpha then inimigo.alpha = 1 end
				end)

				if (inimigo.vida <= 0) then
					display.remove(inimigo)
					moedas = moedas + 1
					kill = kill + 1
					textoMoeda.text = moedas

					if (kill >= 5 and not bossAtivo) then
						criaBoss()
					end
				end
			end

			-- TIRO E BOSS
			if ((obj1.id == 'tiroID' and obj2.id == 'bossID') or (obj1.id == 'bossID' and obj2.id == 'tiroID')) then
				local tiro = (obj1.id == 'tiroID') and obj1 or obj2
				local boss = (obj1.id == 'bossID') and obj1 or obj2

				display.remove(tiro)
				boss.vida = boss.vida - danoAviao

				transition.blink(boss, {time = 200})
				timer.performWithDelay(250, function()
					if boss and boss.alpha then boss.alpha = 1 end
				end)

				if (boss.vida <= 0) then
					display.remove(boss)
					moedas = moedas + 10
					textoMoeda.text = moedas
					gameOver(true)
				end
			end

			-- AVIAO E BOSS TIRO
			if ((obj1.id == 'aviaoID' and obj2.id == 'bossTiroID') or (obj1.id == 'bossTiroID' and obj2.id == 'aviaoID')) then
				local btiro = (obj1.id == 'bossTiroID') and obj1 or obj2
				display.remove(btiro)

				vida = vida - 1
				transition.blink(aviao, {time = 300})
				timer.performWithDelay(500, function()
					if aviao and aviao.alpha then aviao.alpha = 1 end
				end)
			end

			-- AVIAO E INIMIGO / BOSS
			if ((obj1.id == 'aviaoID' and obj2.id == 'inimigoID') or (obj1.id == 'inimigoID' and obj2.id == 'aviaoID')) then
				local inimigo = (obj1.id == 'inimigoID') and obj1 or obj2
				display.remove(inimigo)

				vida = vida - 1
				transition.blink(aviao, {time = 300})
				timer.performWithDelay(500, function()
					if aviao and aviao.alpha then aviao.alpha = 1 end
				end)
			end
		end
	end
	Runtime:addEventListener('collision', verificaColisao)

	-- CLEANUP ON SCENE HIDE
	function self:hide( event )
		if ( event.phase == "will" ) then
			Runtime:removeEventListener('enterFrame', gerarFundo)
			Runtime:removeEventListener('enterFrame', moverAviao)
			Runtime:removeEventListener('enterFrame', verificaMunicao)
			Runtime:removeEventListener('enterFrame', verificaVida)
			Runtime:removeEventListener('collision', verificaColisao)
			Runtime:removeEventListener('key', onKeyEvent)
			if timerInimigo then timer.cancel(timerInimigo) end
			if timerBossAtaque then timer.cancel(timerBossAtaque) end
			if timerBossMovimento then timer.cancel(timerBossMovimento) end
			audio.stop()
		end
	end
	self:addEventListener( "hide", self )
end

cena:addEventListener( 'create', cena )
return cena