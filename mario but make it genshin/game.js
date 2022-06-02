// some methods referenced from game.js at https://github.com/kubowania/mario/blob/main/game.js

kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1],
  })
  
  // speed constants
  const MOVE_SPEED = 120
  const JUMP_FORCE = 400
  const MAP_BOUNDARY = 400
  const ENEMY_SPEED = 20
  const SCORE_TEXT = 'Score: '
  
  let isJumping = true
  
// loading sprites from imgur

loadRoot('https://i.imgur.com/')

loadSprite('diluc', 'D8uIwpv.png')
loadSprite('chest', '9wPvinc.png')
loadSprite('slime', 'OVtTdXU.png')
loadSprite('electroculus', 'qPKObux.png')
loadSprite('grass', 'bo78EE2.png')
loadSprite('boulder', 'hSwCufW.png')
loadSprite('waypoint', '0mBSlIm.png')
loadSprite('primogem', 'N7v0uKI.png')
loadSprite('tree', 'UBr1lhU.png')
loadSprite('snow block', 'NvfK1Og.png')
loadSprite('snow', 'NewCeik.png')
loadSprite('cicin', 'O7ydgvH.png')
loadSprite('agate', 'gwvxNGi.png')
loadSprite('lumenspar', 'mL4tpsk.png')
loadSprite('obsidian', '56zDhsH.png')


  scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')
  
    const maps = [
        [
        '                                      ',
        '                  *                   ',
        '                                      ',
        '                 %%%                  ',
        ' &                       &            ',
        '     %%   %%%                         ',
        '                                      ',
        '                             +        ',
        '                    ^   ^          $  ',
        '==============================   =====',
        ],
        [
        '                                      ',
        'x                                    x',
        'x      ~           $            +    x',
        'x                 xxx                x',
        'x      x                       xxx   x',
        'x         x                 xx       x',
        'x             x          x       ~   x',
        'x                     .   .          x',
        'x                                    x',
        '######################################',
        ],
        [
          '                                      ',
          '%                                    %',
          '%                           <        %',
          '%                                    %',
          '%                <         %%%       %',
          '%                                    %',
          '%           %    %    %              %',
          '%                                +   %',
          '%                                    %',
          '%%%%%%%%%%%%!!!!!!!!!!!%%%%%%%%%%%%%%%',
          ]
      
    ]
  
    const sceneComponents = {
        width: 20,
        height: 20,
        '=': [sprite('grass'), solid(), scale(2)],
        '%': [sprite('boulder'), solid()],
        '^': [sprite('slime'), 'enemy'],
        '+': [sprite('waypoint'), solid(), 'waypoint'],
        '*': [sprite('electroculus'), 'collectable'],
        '$': [sprite('chest'), solid(), 'chest', scale(1.5)],
        '@': [sprite('primogem'), 'primogem'],
        '&': [sprite('tree'), scale(2)],
        '#': [sprite('snow block'), solid(), scale(1.20)],
        'x': [sprite('snow'), solid()],
        '.': [sprite('cicin'), scale(1.5), 'enemy'],
        '~': [sprite('agate'), 'collectable'],
        '!': [sprite('obsidian'), 'toxic'],
        '<': [sprite('lumenspar'), 'collectable']
    
    }
  
    const gameLevel = addLevel(maps[level], sceneComponents)
  
    const scoreLabel = add([
      text('Score: ' + score),
      pos(30, 6),
      layer('ui'), 
      {
        value: score,
      }
    ])
  
    add([text('Level: ' + parseInt(level + 1) ), pos(120, 6)])
  
    const player = add([
      sprite('diluc'), solid(), pos(50, 0), body(), origin('bot')])

    player.collides('collectable', (col) => {
        destroy(col)
        scoreLabel.value++
        scoreLabel.text = SCORE_TEXT + scoreLabel.value
    })

    player.collides('chest', (c) => {
        if (isJumping) {
            destroy(c)
            gameLevel.spawn('@', c.gridPos.sub(0,5))
        }
    })

    player.collides('primogem', (p) => {
        destroy(p)
        scoreLabel.value++
        scoreLabel.text = SCORE_TEXT + scoreLabel.value
    })

    player.collides('toxic', (d) => {
      go('lose', { score: scoreLabel.value})
    })


    action('enemy', (e) => {
      e.move(-ENEMY_SPEED, 0)
    })
  
    player.collides('enemy', (e) => {
      if (isJumping) {
        destroy(e)
        scoreLabel.value++
        scoreLabel.text = SCORE_TEXT + scoreLabel.value
      } else {
        go('lose', { score: scoreLabel.value})
      }
    })
  
    player.action(() => {
      camPos(player.pos)
      if (player.pos.y >= MAP_BOUNDARY) {
        go('lose', { 
            score: scoreLabel.value
        })
      }
    })
  
    player.collides('waypoint', () => {
      keyPress('down', () => {
        go('game', {
          level: (level + 1) % maps.length,
          score: scoreLabel.value
        })
      })
    })

    // keyboard events
  
    keyDown('left', () => {
      player.move(-MOVE_SPEED, 0)
    })
  
    keyDown('right', () => {
      player.move(MOVE_SPEED, 0)
    })
  
    player.action(() => {
      if(player.grounded()) {
        isJumping = false
      }
    })
  
    keyPress('space', () => {
      if (player.grounded()) {
        isJumping = true
        player.jump(JUMP_FORCE)
      }
    })
  })
  
  scene('lose', ({ 
      score 
    }) => {
    add([text('Game Over!', 28), origin('center'), pos(width()/2, height()/2)])
    add([text('Score: ' + score, 28), origin('center'), pos(width()/2, height()/ 2 + 50)])
  })
  
  start("game", { 
      level: 0, score: 0
    })

