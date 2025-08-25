    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const backToLoginLink = document.getElementById('backToLogin');

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
        container.classList.remove("show-reset");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
        container.classList.remove("show-reset");
    });

    forgotPasswordLink.addEventListener('click', () => {
        container.classList.add("show-reset");
    });

    backToLoginLink.addEventListener('click', () => {
        container.classList.remove("show-reset");
    });

    /* ---------- Background Animation ---------- */
    const canvas = document.getElementById("techCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let nodes = [];
    const numNodes = 80;

    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                let dx = nodes[i].x - nodes[j].x;
                let dy = nodes[i].y - nodes[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.strokeStyle = `rgba(0, 195, 255, ${1 - dist / 150})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        for (let i = 0; i < numNodes; i++) {
            ctx.beginPath();
            ctx.arc(nodes[i].x, nodes[i].y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#00c3ff";
            ctx.fill();

            nodes[i].x += nodes[i].vx;
            nodes[i].y += nodes[i].vy;

            if (nodes[i].x < 0 || nodes[i].x > canvas.width) nodes[i].vx *= -1;
            if (nodes[i].y < 0 || nodes[i].y > canvas.height) nodes[i].vy *= -1;
        }

        requestAnimationFrame(animate);
    }

    animate();