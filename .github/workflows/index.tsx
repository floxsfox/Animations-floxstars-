import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Floxstars} from './Floxstars';

const Root: React.FC = () => (
  <Composition
    id="Floxstars"
    component={Floxstars}
    durationInFrames={210} // 7 detik @ 30fps
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
