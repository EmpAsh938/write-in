const validEmail = (email) => {
    return (/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/).test(email);
}

module.exports = { validEmail }
