export type Mat3 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export function identity(): Mat3 {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

export function translation(tx: number, ty: number): Mat3 {
  return [1, 0, 0, 0, 1, 0, tx, ty, 1];
}

export function translate(mat: Mat3, tx: number, ty: number): Mat3 {
  return multiply(translation(tx, ty), mat);
}

export function rotation(rad: number): Mat3 {
  const c = Math.cos(rad);
  const s = Math.sin(rad);

  return [c, -s, 0, s, c, 0, 0, 0, 1];
}

export function rotate(mat: Mat3, rad: number): Mat3 {
  return multiply(rotation(rad), mat);
}

export function scaling(sx: number, sy: number): Mat3 {
  return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
}

export function scale(mat: Mat3, sx: number, sy: number): Mat3 {
  return multiply(scaling(sx, sy), mat);
}

/**
 * Создает матрицу проекции, которая переворачивает ось oY, чтобы 0 был наверху
 */
export function projection(width: number, height: number): Mat3 {
  return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1];
}

export function multiply(a: Mat3, b: Mat3): Mat3 {
  var a00 = a[0 * 3 + 0];
  var a01 = a[0 * 3 + 1];
  var a02 = a[0 * 3 + 2];
  var a10 = a[1 * 3 + 0];
  var a11 = a[1 * 3 + 1];
  var a12 = a[1 * 3 + 2];
  var a20 = a[2 * 3 + 0];
  var a21 = a[2 * 3 + 1];
  var a22 = a[2 * 3 + 2];
  var b00 = b[0 * 3 + 0];
  var b01 = b[0 * 3 + 1];
  var b02 = b[0 * 3 + 2];
  var b10 = b[1 * 3 + 0];
  var b11 = b[1 * 3 + 1];
  var b12 = b[1 * 3 + 2];
  var b20 = b[2 * 3 + 0];
  var b21 = b[2 * 3 + 1];
  var b22 = b[2 * 3 + 2];

  return [
    b00 * a00 + b01 * a10 + b02 * a20,
    b00 * a01 + b01 * a11 + b02 * a21,
    b00 * a02 + b01 * a12 + b02 * a22,
    b10 * a00 + b11 * a10 + b12 * a20,
    b10 * a01 + b11 * a11 + b12 * a21,
    b10 * a02 + b11 * a12 + b12 * a22,
    b20 * a00 + b21 * a10 + b22 * a20,
    b20 * a01 + b21 * a11 + b22 * a21,
    b20 * a02 + b21 * a12 + b22 * a22,
  ];
}

export function invert(mat: Mat3) {
  let a00 = mat[0],
    a01 = mat[1],
    a02 = mat[2];
  let a10 = mat[3],
    a11 = mat[4],
    a12 = mat[5];
  let a20 = mat[6],
    a21 = mat[7],
    a22 = mat[8];

  let b01 = a22 * a11 - a12 * a21;
  let b11 = -a22 * a10 + a12 * a20;
  let b21 = a21 * a10 - a11 * a20;

  // Calculate the determinant
  let det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  return [
    b01 * det,
    (-a22 * a01 + a02 * a21) * det,
    (a12 * a01 - a02 * a11) * det,
    b11 * det,
    (a22 * a00 - a02 * a20) * det,
    (-a12 * a00 + a02 * a10) * det,
    b21 * det,
    (-a21 * a00 + a01 * a20) * det,
    (a11 * a00 - a01 * a10) * det,
  ] as Mat3;
}

export function transformPoint(
  point: [number, number],
  mat: Mat3
): [number, number] {
  var x = point[0],
    y = point[1];
  const out: [number, number] = [0, 0];
  out[0] = mat[0] * x + mat[3] * y + mat[6];
  out[1] = mat[1] * x + mat[4] * y + mat[7];
  return out;
}
