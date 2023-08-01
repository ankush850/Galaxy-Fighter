local composer = require('composer')
local cena = composer.newScene()

function cena:create( event )
	local cenaIniciar = self.view

	local x = display.contentWidth
	local y = display.contentHeight
	local t = (x + y) / 2

	local somTransicao = audio.loadSound('recursos/audio/transicao.mp3')

	local fundo = display.newImageRect( cenaIniciar, 'recursos/imagens/BG/sky_background_mountains.png', x, y)
	fundo.x = x*0.5
	fundo.y = y*0.5

	local sombra = display.newRect( cenaIniciar, x*0.5, y*0.5, x, y )
	sombra:setFillColor( 0, 0, 0)
	sombra.alpha = 0.5

	local icone = display.newImageRect(cenaIniciar, 'recursos/imagens/UI/touch.png', t*0.08, t*0.08)
	icone.x = x*0.5
	icone.y = y*0.55

	local texto = display.newText(cenaIniciar, 'GALAXY FIGHTER', x*0.5, y*0.25, nil, t*0.08)
	texto:setFillColor(1, 0.9, 0.2)

	local textoSub = display.newText(cenaIniciar, 'Toque na tela ou pressione ESPAÇO para começar!', x*0.5, y*0.38, nil, t*0.04)

	local function iniciarJogo()
		if somTransicao then audio.play(somTransicao) end
		composer.gotoScene('cenas.jogo', {
			time = 300, effect = 'fade'
		})
	end

	local function verificaToque( event )
		if (event.phase == 'began') then
			iniciarJogo()
		end
		return true
	end
	Runtime:addEventListener( 'touch', verificaToque )

	local function verificaTecla( event )
		if event.phase == 'down' and (event.keyName == 'space' or event.keyName == 'enter') then
			iniciarJogo()
		end
		return false
	end
	Runtime:addEventListener( 'key', verificaTecla )

	function self:hide( event )
		if ( event.phase == "will" ) then
			Runtime:removeEventListener('touch', verificaToque)
			Runtime:removeEventListener('key', verificaTecla)
		end
	end
	self:addEventListener( "hide", self )
end

cena:addEventListener( 'create', cena )
return cena