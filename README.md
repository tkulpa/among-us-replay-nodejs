<p align="center">
  <a href="https://store.steampowered.com/app/945360/Among_Us/"><img src="https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg"></a>
</p>

# Among Us Replay - NodeJS Parser (Alpha)

This package allows parsing `.aurp` replays saved with [this mod](https://github.com/Smertig/among-us-replay-mod) inside NodeJS environment.

# Installation

```bash
yarn add @tkulpa/among-us-replay-nodejs
```

or

```bash
npm install @tkulpa/among-us-replay-nodejs
```

# Usage

```js
const amongUsReplay = require('@tkulpa/among-us-replay-nodejs');

amongUsReplay(`assets/replays/replay.aurp`).then(({ map_id, events }) => {
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
```

## Results:

### Skeld

All Players pathing across whole game
![skeld replay](/example/output/skeld.png 'Skeld Replay')
_Example implementation inside `example` folder_

### Polus

All Players pathing across whole game
![polus replay](/example/output/polus.png 'Polus Replay')
_Example implementation inside `example` folder_

### Mira HQ All Players pathing across whole game

All Players pathing across whole game
![mira hq replay](/example/output/mira_hq.png 'Mira HQ Replay')
_Example implementation inside `example` folder_
