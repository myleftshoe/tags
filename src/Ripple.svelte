<script>
    function rippleEffect(e) {
        const btn = e.currentTarget;

        const circle = document.createElement('span');
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - (btn.offsetLeft + radius)}px`;
        circle.style.top = `${e.clientY - (btn.offsetTop + radius)}px`;
        circle.classList.add('ripple');

        const ripple = btn.getElementsByClassName('ripple')[0];

        if (ripple) {
            ripple.remove();
        }

        btn.appendChild(circle);
    }

    const btn = document.getElementById('bt');
    btn.addEventListener('click', rippleEffect);
</script>
