$(document).ready(function(){

  var maxX = 800, maxY = 600;
  var enemies = [];
  var x;
  var y;
  var r = 20;
  var newEnemy;
  var collisionCount = 0;
  var currentScore = 0;
  var highScore = 0;


  var init = function() {
    for (var i = 0; i < 50; i++) {
      newEnemy = new Enemy(0, 0, r);
      enemies.push(newEnemy);
    }
  };

  var drawUser = function () {
    var user = d3.select('.arena')
    .append('image')
    .attr('id', 'user')
    .attr('xlink:href', 'img/man.gif')
    .attr('width', '50')
    .attr('height', '50')
    .attr('x', '390')
    .attr('y', '280');
  };

  var drawBlood = function (x, y) {
    var blood = d3.select('.arena')
    .insert('image', '#user')
    .attr('class', 'blood')
    .attr('xlink:href', 'img/blood.png')
    .attr('width', 40 + Math.random() * 20)
    .attr('height', 40 + Math.random() * 20)
    .attr('x', x + 30 * (Math.random() - 0.5))
    .attr('y', y + 30 * (Math.random() - 0.5))
    .attr('opacity', 0)
    .transition()
    .duration(200)
    .attr('opacity', 1);
  };

  var relocate = function(array){
    for (var i = 0; i < array.length; i++) {
      array[i].x = Math.random() * (maxX - 2 * r) + r;
      array[i].y = Math.random() * (maxY - 2 * r) + r;
    }
  };

  var draw = function(data) {
    var dots = d3.select('.arena').selectAll('circle').data(data);
    dots.enter()
    .append('image')
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    // .attr('r', function(d) { return d.r; })
    .attr('class', 'enemy')
    .attr('xlink:href', 'img/shuriken.gif')
    .attr('width', 40)
    .attr('height', 40);
    // .attr('fill', "url(#image)")
  }

  var update = function(data) {
    var dots = d3.select('.arena').selectAll('.enemy').data(data);
    dots
    .transition()
    .duration(1500)
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; });
  };

  var checkCollision = function(){
    var user = d3.select('#user');
    // here only the first item of the D3 array is the actual array of selected elements
    var enemies = d3.selectAll('.enemy')[0];
    var enemy;
    var userX = parseFloat(user.attr('x'));
    var userY = parseFloat(user.attr('y'));
    var enemyX;
    var enemyY;
    var dist;
    for (var i = 0; i < enemies.length; i++) {
      // here we need to wrap it again with D3 methods, such as attr
      enemy = d3.select(enemies[i]);
      enemyX = parseFloat(enemy.attr('x'));
      enemyY = parseFloat(enemy.attr('y')); //parseFloat
      dist = Math.pow((enemyX - userX), 2) + Math.pow((enemyY - userY), 2);
      if(dist < 40*40) {
        drawBlood(userX, userY);
        onCollision();
      }

    }
  };

  var checkHighScore = function (curr) {
    if (curr > highScore) {
      highScore = currentScore;
      d3.select('.high').text('High Score: ' + highScore.toString());
    }
  }

  var onCollision = function(){
    collisionCount++;
    d3.select('.collisions').text('Collisions: ' + collisionCount.toString());
    checkHighScore(currentScore);
    currentScore = 0;
  }

  var drag = d3.behavior.drag()
    .on('drag', function() {
       c.attr('x', d3.event.x < maxX - 25 ? ( d3.event.x > 25 ? d3.event.x - 25 : 0) : maxX - 50)
        .attr('y', d3.event.y < maxY - 30 ? ( d3.event.y > 30 ? d3.event.y - 30 : 0) : maxY - 60); 
    });

  var Enemy = function (x,y,r) {
    this.x = x;
    this.y = y;
    this.r = r;
  };

  init();
  drawUser();
  relocate(enemies);
  draw(enemies);

  var c = d3.select('#user').call(drag);
  


  setInterval(function(){
    relocate(enemies);
    update(enemies);
  }, 1500);

  setInterval(function(){
    currentScore++;
    d3.select('.current').text('Current Score: ' + currentScore.toString());
  }, 100);

  setInterval(function(){
    checkCollision();
  }, 100);
  // .update(enemies);

});