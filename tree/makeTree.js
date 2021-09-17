// Строится структура дерева за правилами

import { getBetweenBranchAngles, getEndXY } from "../geometry.js";
import { rnd } from "../math.js";


function makeTree(descriptor) {

  const tree = {
    x: descriptor.x,
    y: descriptor.y,
    angle: descriptor.angle,
    length: descriptor.length,
    width: descriptor.width,  //начальная
    branches: [
      // {
      //   trunk: treeTemplate,
      //   x: x,
      //   y: y,
      //   angle: 0,
      //   length,
      //   width,
      //   branches: [],
      //   color,
      //   depth: 1,
      // } 
    ],
    color: descriptor.color,
    depth: 0,
  };
  const branchingRules = {
    rosettePotency: descriptor.branchingPotency,
    bendAngle: descriptor.bendAngle,
    rosetteTotalAngle: descriptor.rosetteTotalAngle,
    lengthRatio: descriptor.branchLengthRatio, 
    widthRatio: descriptor.branchWidthRatio,
    maxDepth: descriptor.maxDepth,
  }
  if (tree.depth < branchingRules.maxDepth) {
    addBranches(tree, branchingRules);
  }
  return tree;
};

function addBranches( tree, rules ) {

  const branchCount = rules.rosettePotency;
  
  const totalAngle = rules.rosetteTotalAngle;
  // const totalAngle = rules.rosetteTotalAngle + (rnd(0, 1.001) < 0.5 ? -1 : 1) * (rules.rosetteTotalAngle / 4);

  const rosetteStartAngle = tree.angle - totalAngle / 2;
  // const roseAngle = tree.angle - totalAngle / 2 + (rnd(0, 1.001) < 0.5 ? -1 : 1) * (totalAngle / 5);

  let betweenBranchAngle = totalAngle / (branchCount - 1);
  // let betweenBranchAngles = getBetweenBranchAngles(totalAngle, branchCount);

  const { x, y } = getEndXY(tree.x, tree.y, tree.length, tree.angle );

  for (let i = 0; i < branchCount; i++) {
    
    const length = tree.length * rules.lengthRatio;
    // const length = tree.length * rules.branchingLength + (rnd(0, 1.001) < 0.8 ? -1 : 1) * (tree.length * rules.branchingLength / 10);

    const width = tree.width * rules.widthRatio;
    // const width = tree.width * rules.branchingWidth + (rnd(0, 1.001) < 0.5 ? -1 : 1) * (tree.width * rules.branchingWidth / 10);

    let branchAngle = rosetteStartAngle + betweenBranchAngle * i;
    
    // if (!tree.branches) tree.branches = [];

    tree.branches[i] = makeBranch(tree, x, y, branchAngle, length, width, tree.color, tree.depth + 1);
    if (tree.depth === rules.maxDepth - 1) {
      tree.branches[i].endWidth = width * rules.widthRatio;
    }
  }
  if (tree.depth < rules.maxDepth - 1) {
    tree.branches?.forEach((branch) => {
      addBranches(branch, rules);
      // addBranches({ tree: branch, branchRules: {  
      //   branchNumber: rules.branchNumber,
      //   roseAngle: roseAngle,
      //   rosetteTotalAngle: totalAngle,
      //   branchingLength: rules.branchingLength, 
      //   branchingWidth: rules.branchingWidth,
      //   maxDepth: rules.maxDepth,
      //   },
      // });
    });
  }
}

//функция генерации ветки
function makeBranch(tree, x, y, branchAngle, length, width, color, depth) {
  return { 
    trunk: tree,
    x: x,
    y: y,
    angle: branchAngle,
    length: length,
    width: width,
    branches: [],
    color: color,
    depth: depth,
  };
}

export { makeTree };