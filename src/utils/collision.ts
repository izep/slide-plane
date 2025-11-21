import Phaser from 'phaser';

export function getBodyBounds(gameObject: any): Phaser.Geom.Rectangle {
  const body = gameObject.body as Phaser.Physics.Arcade.Body;
  return new Phaser.Geom.Rectangle(
    gameObject.x - body.width / 2,
    gameObject.y - body.height / 2,
    body.width,
    body.height
  );
}

export function rectanglesIntersect(a: Phaser.Geom.Rectangle, b: Phaser.Geom.Rectangle): boolean {
  return Phaser.Geom.Intersects.RectangleToRectangle(a, b);
}
