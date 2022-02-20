/*!
 * Check if an element is out of the viewport
 * @param {Node} elem The element to check
 * @return {Object} A set of booleans for each side of the element
 */

const isOutOfViewport = (elem) => {
    if (elem) {
        const bounding = elem.getBoundingClientRect();

        const out = {};
        out.top = bounding.top < 0;
        out.left = bounding.left < 0;
        out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
        out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
        out.any = out.top || out.left || out.bottom || out.right;
        out.all = out.top && out.left && out.bottom && out.right;

        return out;
    } else {
        return undefined;
    }
};

export default isOutOfViewport;