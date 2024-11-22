function throttle(func, delay) {
    let lastcall = 0;
    return () => {
        if ((new Date().getTime() - lastcall) > delay) {
            lastcall = new Date().getTime();
            func();
        }
    }
}

const caller = throttle(() => {
    console.log("throttle is called");
}, 2000);

window.addEventListener("resize", caller);

