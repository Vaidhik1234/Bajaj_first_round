function debounce(func, delay) {
    let timer;
    return () => {
        clearTimeout(timer)
        timer = setTimeout(func, delay);
    }
}

const debounceSearch = debounce((query) => {
    console.log(`Searching for: ${query}`);
}, 3000);

window.addEventListener("resize", debounceSearch);