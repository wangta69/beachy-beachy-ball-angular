const levels = [
  {
    name: "Copacabana",
    difficulty: 1,
    blocks: [
      // 19
      'BlockEmpty',
      'BlockEmpty',
      'BlockSpinner',
      'BlockEmpty',
      'BlockEmpty',
      'BlockSlidingWall',
      'BlockEmpty',
      'BlockEmpty',
      'BlockLimbo',
      'BlockEmpty',
      'BlockEmpty',
      'BlockDoubleSpinner',
      'BlockEmpty',
      'BlockEmpty',
      'BlockDoubleLimbo',
      'BlockEmpty',
      'BlockEmpty',
      'BlockDoubleSlidingWall',
      'BlockEmpty',
    ],
    count: 0 // 아래에 프로그램적으로 세팅
  },
  {
    name: "Santa Monica",
    difficulty: 1,
    blocks: [
      // 34
      'BlockEmpty',
      'BlockEmpty',
      'BlockSpinner',
      'BlockDoubleSpinner',
      'BlockEmpty',
      'BlockSlidingWall',
      'BlockDoubleSlidingWall',
      'BlockEmpty',
      'BlockLimbo',
      'BlockDoubleLimbo',
      'BlockEmpty',
      'BlockEmpty',
      'BlockDoubleSpinner',
      'BlockDoubleSpinner',
      'BlockDoubleSlidingWall',
      'BlockDoubleSlidingWall',
      'BlockDoubleLimbo',
      'BlockDoubleLimbo',
      'BlockDoubleSpinner',
      'BlockDoubleSlidingWall',
      'BlockDoubleLimbo',
      'BlockDoubleSpinner',
      'BlockDoubleSpinner',
      'BlockDoubleSpinner',
      'BlockDoubleSlidingWall',
      'BlockDoubleSlidingWall',
      'BlockDoubleSlidingWall',
      'BlockDoubleLimbo',
      'BlockDoubleLimbo',
      'BlockDoubleLimbo',
      'BlockDoubleSpinner',
      'BlockDoubleSlidingWall',
      'BlockDoubleLimbo',
      'BlockEmpty',
    ],
    count: 0 // 아래에 프로그램적으로 세팅
  },
];

levels.forEach((level: any) => {
  level.count = level.blocks.length;
});

export default levels;
