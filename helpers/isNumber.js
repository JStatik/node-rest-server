const isNumber = ( value ) => {
    if( !value ) return false;

    if( isNaN( value ) ) {
        return false;
    } else {
        return true;
    }
};

module.exports = {
    isNumber
};
