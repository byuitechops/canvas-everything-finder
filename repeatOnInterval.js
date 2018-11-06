module.exports = async function recursion(functions = [], interval = 5000) {
    setTimeout(() => {
        functions.forEach((funct) => {
            funct();
        });
        recursion(functions);
    }, interval);
};