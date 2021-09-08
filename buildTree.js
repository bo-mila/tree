import { halfPI, getUpPointsBranch, getCenterXY } from "./geometry.js";
import { rnd } from "./math.js";

//функция генерации экземпляра дерева                                   
function makeTree({x, y, branchNumber, length, branchingLength, width, branchingWidth, branchingTotalAngle, maxCurvature = 0, iteration = 0}) {
  const { leftUpX: leftUpX, leftUpY: leftUpY, rightUpX: rightUpX, rightUpY: rightUpY } = getUpPointsBranch({ x: x, y: y, length: length, width: width * branchingWidth });
  
  const tree = {
    x: x,
    y: y, 
    leftDownX: x - width / 2,
    leftDownY: y,
    rightDownX: x + width / 2,
    rightDownY: y,
    leftUpX: leftUpX, 
    leftUpY: leftUpY,
    rightUpX: rightUpX,
    rightUpY: rightUpY,
    curvature: 0,
    angle: -halfPI,
    length: length,
    width: width,
    endWidth: width * branchingWidth,
    color: "#4D2323",
    depth: 0,
  };
  if (iteration !== 0) {
    addBranches({ tree: tree, count: branchNumber, branchingLength: branchingLength, branchingWidth: branchingWidth, totalAngle: branchingTotalAngle, angle: tree.angle, iteration: iteration - 1 });
  }
  return tree;
}

//функция генерации детей
function addBranches({ tree, count, branchingLength, branchingWidth, totalAngle, angle, maxCurvature = 0, iteration = 0 }) {

  if (!tree.branches) tree.branches = [];
  const leftBranchAngle = angle - totalAngle / 2;
  // const leftBranchAngle = -totalAngle / 2 + angle ;
  // const betweenBranchAngle = totalAngle / (count - 1);
  console.log(count);
  let betweenBranchAngles = [];
  betweenBranchAngles[0] = totalAngle;
  for (let i = 1; i < count - 1; i++) {
    betweenBranchAngles[i] = rnd(0, totalAngle);
  }
  betweenBranchAngles.push(0);
  betweenBranchAngles.sort();
  console.log(betweenBranchAngles);
  const length = tree.length * branchingLength;
  const width = tree.width * branchingWidth;
  const { x: centerX, y: centerY} = getCenterXY(tree.leftUpX, tree.leftUpY, tree.rightUpX, tree.rightUpY);
  

  for (let i = 0; i < count; i++) {
    const curvature = i === (count -1) / 2? 0 : i < (count - 1) / 2? maxCurvature : -maxCurvature;
    let branchAngle = leftBranchAngle + betweenBranchAngles[i];
    const { leftUpX: leftUpX, leftUpY: leftUpY, rightUpX: rightUpX, rightUpY: rightUpY } = getUpPointsBranch({ x: centerX, y: centerY, length: length, width: width * branchingWidth, angle: branchAngle });
    tree.branches[i] = makeBranch(tree, leftUpX, leftUpY, rightUpX, rightUpY, branchAngle, length, width, curvature, "#4D2323", tree.depth + 1);
  }
  if (iteration !== 0) {
    tree.branches.forEach((branch) => {
      addBranches({ tree: branch, count: count, branchingLength: branchingLength, branchingWidth: branchingWidth, totalAngle: totalAngle, angle: branch.angle, maxCurvature: maxCurvature, iteration: iteration - 1 });
    });
  }
}

//функция генерации ветки
function makeBranch(tree, leftUpX, leftUpY, rightUpX, rightUpY, angle, length, width, curvature, color, depth) {
  return { 
    leftDownX: tree.leftUpX,
    leftDownY: tree.leftUpY,
    rightDownX: tree.rightUpX,
    rightDownY: tree.rightUpY,
    leftUpX: leftUpX, 
    leftUpY: leftUpY,
    rightUpX: rightUpX,
    rightUpY: rightUpY,
    curvature: 0,
    angle: angle,
    length: length,
    width: width,
    color: color,
    depth: depth,
    // tree, angle, length, width, curvature, color, depth 
  };
}

export { makeTree, addBranches };