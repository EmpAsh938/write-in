const validEmail = (email) => {
    return /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(email);
}

module.exports = { validEmail }
