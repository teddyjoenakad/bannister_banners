window.onload = function() {
    const canvas = document.getElementById('gauge');
    const ctx = canvas.getContext('2d');
    const clickable = document.getElementById('clickableArea');
    const carImages = document.querySelectorAll('.car-img');
    const discoverLink = document.getElementById('discoverLink');
    const carNameElement = document.getElementById('carName');
    
    const config = [
        { price: 124, name: "TrailBlazer LT", link: "https://www.bannisterchevkamloops.com/inventory/2025-chevrolet-trailblazer-lt-5V2QOzsiSGOp1ZpquNDyqQvdp/" },
        { price: 169, name: "Silverado 1500 Custom Trail Boss", link: "https://www.bannisterchevkamloops.com/inventory/2023-chevrolet-silverado-1500-custom-trail-boss-cLTlVoEORzqd9EpfwlUaYgvdp/" },
        { price: 241, name: "Silverado 3500HD LT", link: "https://www.bannisterchevkamloops.com/inventory/2022-chevrolet-silverado-3500hd-lt-q4ChZh2lSeeawyHbuVHRKwvdp/" },
        { price: 263, name: "Silverado 2500HD LT", link: "https://www.bannisterchevkamloops.com/inventory/2024-chevrolet-silverado-2500hd-lt-mLfFfHccSCqWjQmdgDdN5Avdp/" }
    ];

    const prices = config.map(c => c.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    let currentIndex = 0;
    let targetValue = config[0].price;
    let currentValue = config[0].price; 
    const lerpSpeed = 0.05; // Smooth gauge movement

    // Initialize odometer
    const priceLabel = document.getElementById('priceLabel');
    priceLabel.className = 'odometer';
    const odometer = new Odometer({
        el: priceLabel,
        value: config[0].price,
        format: 'ddd',
        theme: 'default'
    });

    function draw() {
        const diff = targetValue - currentValue;
        currentValue += diff * lerpSpeed;
        if (Math.abs(diff) < 0.1) currentValue = targetValue;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 110;
        
        const startAngle = 0.75 * Math.PI; 
        const endAngle = 2.25 * Math.PI;
        const percent = (currentValue - minPrice) / (maxPrice - minPrice);
        const currentAngle = startAngle + (percent * (endAngle - startAngle));

        // Background Track
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = '#e6e6e6';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Progress Arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
        ctx.strokeStyle = '#ce9a0ccb'; 
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Dot
        const dotX = centerX + Math.cos(currentAngle) * radius;
        const dotY = centerY + Math.sin(currentAngle) * radius;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 16, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ce9a0ccb';
        ctx.lineWidth = 2;
        ctx.stroke();

        requestAnimationFrame(draw);
    }

    clickable.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % config.length;
        targetValue = config[currentIndex].price;

        // Update odometer with smooth animation
        odometer.update(config[currentIndex].price);

        // --- FADE ANIMATION LOGIC ---
        carNameElement.classList.remove('fade-in-slow'); // Reset animation
        void carNameElement.offsetWidth;                // Trigger reflow
        carNameElement.innerText = config[currentIndex].name; 
        carNameElement.classList.add('fade-in-slow');    // Restart animation

        // Update Button Link
        discoverLink.href = config[currentIndex].link;

        // Switch Images
        carImages.forEach((img, idx) => {
            img.classList.toggle('active', idx === currentIndex);
        });
    });

    // Initialize
    discoverLink.href = config[0].link;
    carNameElement.classList.add('fade-in-slow');
    draw();
};