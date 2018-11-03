/*************************************************************************
 * 
 *************************************************************************/
module.exports = function limitObjectKeysWrapper (object = {}, keysToKeep = []) {
    // This function is slower, but will not create keys on the output unless it existed on the original too.
    function limitObjectKeys (object, keysToKeep = []) {
        return Object.keys(object).reduce( (acc, objectKey) => {
            if ( keysToKeep.some( key => key === objectKey ) )
                acc[objectKey] = object[objectKey];
            return acc;
        }, {} );
    }
    
    // This Function is faster, but may create keys on the output that didn't exist on the original object
    function specifyObjectKeys (object, keysToKeep = []) {
        return keysToKeep.reduce( (acc, keyToKeep) => {
            acc[keyToKeep] = object[keyToKeep];
            return acc;
        }, {} );
    } 
    
    // Make sure we are limiting keys on an object or array
    if (object === null || typeof object !== 'object')
        object = {[object]: object}; // If not implicitly convert the value to an object
    // Make sure the keys to keep come in the form of an array
    if ( !Array.isArray(keysToKeep) )
        throw 'in limitObjectKeys, the second parameter must be an array'; 
    
    return limitObjectKeys  (object, keysToKeep);
    return specifyObjectKeys(object, keysToKeep);
    
};
