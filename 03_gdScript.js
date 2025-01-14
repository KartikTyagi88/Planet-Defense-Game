const canvas = document.getElementById('gameCanvas')
        const context = canvas.getContext('2d')  //This is the 2d context object
        let cH = context.canvas.height = window.innerHeight;
        let cW = context.canvas.width = window.innerWidth;

      function gameRestart(){
        let planet = {
          x: cW/2,
          y: cH/2,
          radius: 40
      }
      let projectiles = []
      let aliens = []
      let score = 0
      let gameOver = false;

      canvas.addEventListener('click', function(e){
          let dx = e.clientX - planet.x;
          let dy = e.clientY - planet.y;
          const angle = Math.atan2(dy,dx);
          projectiles.push({x: planet.x,
              y: planet.y,
              vx: (Math.cos(angle))*10,
              vy: (Math.sin(angle))*10
          })
      })

      //Spawning aliens:
      setInterval(()=>{
        if(!gameOver){
          let x = Math.random()*canvas.width;
          aliens.push({x,
              y: 0,
              vx: (Math.random()+1)*(planet.x-x)/300,
              vy: (Math.random()+1)*(planet.y-0)/300,
              alienRadius: 30*(Math.random() + 0.5)
          })
        }
      },600)

      function gameLoop(){
          if(gameOver) return

          //Clearing the canvas before the start of each frame:
          context.clearRect(0,0,canvas.width, canvas.height)

          //Drawing the planet:
          context.beginPath()
          context.arc(planet.x, planet.y, planet.radius, 0, Math.PI*2);
          context.fillStyle = '#33acff';
          context.fill()

          //Update and draw projectiles:
          projectiles.forEach((p, i)=>{
            p.x += p.vx
            p.y += p.vy

            context.beginPath();
            context.arc(p.x, p.y, 5,0, Math.PI*2)
            context.fillStyle = '#ff0';
            context.fill();
          })

          //Update and draw aliens:
          aliens.forEach((a, i)=>{
             a.x += a.vx,
             a.y += a.vy;

             context.beginPath();
             context.arc(a.x, a.y,a.alienRadius,0,Math.PI*2);
             context.fillStyle = '#f00';
             context.fill()

             //Checking collision with planet:
             const distanceToPlanet = Math.hypot(a.x-planet.x, a.y - planet.y);
             if(distanceToPlanet < planet.radius + a.alienRadius){
              gameOver = true;
             }

             //Checking collision with projectiles:
             projectiles.forEach((p,j)=>{
                const distanceToProjectiles = Math.hypot(a.x-p.x, a.y-p.y);
                if(distanceToProjectiles < a.alienRadius){
                  aliens.splice(i, 1);
                  projectiles.splice(j, 1);
                  score += 10;
                }
             })

             //Removing enemies that goes off screen:
             if(a.y > canvas.height){
              aliens.splice(i,1)
             }
          });

          //Display score:
          context.fillStyle = "#fff";
          context.font = "20px Arial";
          context.fillText(`Score: ${score}`, 10, 30);

          requestAnimationFrame(gameLoop);

          if(gameOver){
            //Display Final score:
            context.fillStyle = "#fff";
            context.font = "40px Arial";
            context.fillText(`GAME OVER! YOUR FINAL SCORE IS: ${score}`, cW/4, (2*cH)/3);
            context.fillText(`Click on restart to start again`, cW/3, (5*cH)/6);

            document.querySelector('#restart').addEventListener('click', function(e){
              gameRestart();
            })
          }
      }

      //Starting the game:
      gameLoop()
      }

      gameRestart()