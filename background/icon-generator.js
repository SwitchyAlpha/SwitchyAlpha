export function getIconCanvas() {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', 96);
    canvas.setAttribute('height', 96);
    const ctx = canvas.getContext('2d');
  
    /*
                 2
                 *   ---
                * *   b
              3*   * ---
                *   *
       ---  6*   *   *
        d   * *   *   *
       --- *****   *****
           5   7   4   1
           |-c-|   |-a-|
     */
  
    // Calculate properties
    const width = canvas.width * 0.8;
    const height = canvas.height * 0.8;
    const centerX = canvas.width * 0.5;
    const bottomY = canvas.height * 0.9;
  
    const da = width * 0.3;
    const db = da / width * height;
    const dc = width * 0.5;
    const dd = dc / width * height;
  
    const p1 = { x: centerX + width / 2, y: bottomY          };
    const p2 = { x: centerX,             y: bottomY - height };
    const p3 = { x: p2.x - da / 2,       y: p2.y + db        };
    const p4 = { x: p1.x - da,           y: p1.y              };
    const p5 = { x: centerX - width / 2, y: bottomY          };
    const p6 = { x: p5.x + dc / 2,       y: p5.y - dd        };
    const p7 = { x: p5.x + dc,           y: p5.y              };
  
    // Draw larger polygon
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.fillStyle = 'rgba(0, 0, 200)';
    ctx.fill();
  
    // Draw smaller polygon
    ctx.beginPath();
    ctx.moveTo(p5.x, p5.y);
    ctx.lineTo(p6.x, p6.y);
    ctx.lineTo(p7.x, p7.y);
    ctx.fillStyle = 'rgba(0, 200, 0)';
    ctx.fill();

    return canvas;
}
