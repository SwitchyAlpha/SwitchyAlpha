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
    const center_x = canvas.width * 0.5;
    const bottom_y = canvas.height * 0.8;
  
    const d_a = width * 0.3;
    const d_b = d_a / width * height;
    const d_c = width * 0.5;
    const d_d = d_c / width * height;
  
    const p1 = { x: center_x + width / 2, y: bottom_y          };
    const p2 = { x: center_x,             y: bottom_y - height };
    const p3 = { x: p2.x - d_a / 2,       y: p2.y + d_b        };
    const p4 = { x: p1.x - d_a,           y: p1.y              };
    const p5 = { x: center_x - width / 2, y: bottom_y          };
    const p6 = { x: p5.x + d_c / 2,       y: p5.y - d_d        };
    const p7 = { x: p5.x + d_c,           y: p5.y              };
  
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
