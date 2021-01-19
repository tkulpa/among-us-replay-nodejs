const amongUsReplay = require('../dist');

mapsData = [
  {
    // SKELD, map id: 0
    offsets: [2558, 730.5],
    scale: 90,
    imgPath: 'assets/maps/skeld.png',
  },
  {
    // MIRA HQ, map id: 1
    offsets: [1218.5, 2750.5],
    scale: 90,
    imgPath: 'assets/maps/mira_hq.png',
  },
  {
    // POLUS, map id: 2
    offsets: [181, 366],
    scale: 87,
    imgPath: 'assets/maps/polus.png',
  },
];

amongUsReplay(`assets/replays/polus.aurp`).then(({ map_id, events }) => {
  const p5 = require('node-p5');
  const mapData = mapsData[map_id || 0];

  function sketch(p, { mapImage }) {
    const convertX = (pos) => pos * mapData.scale + mapData.offsets[0];
    const convertY = (pos) => pos * -mapData.scale + mapData.offsets[1];

    p.setup = () => {
      let canvas = p.createCanvas(mapImage.width, mapImage.height);
      p.image(mapImage, 0, 0);
      setTimeout(async () => {
        const filename = await p.saveCanvas(
          canvas,
          `output/${replayName}`,
          'png'
        );
        console.log(`saved the canvas as ${filename}`);
      }, 100);
      p.noLoop();
    };

    p.draw = () => {
      p.stroke('red');
      p.strokeWeight(10);
      events.forEach((e) =>
        e.player_states.forEach(
          ({ is_dead, position_x, position_y }) =>
            !is_dead && p.point(convertX(position_x), convertY(position_y))
        )
      );
    };
  }
  p5.createSketch(sketch, { mapImage: p5.loadImage(mapData.imgPath) });
});
