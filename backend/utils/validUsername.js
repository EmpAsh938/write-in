const validUsername = (username) => {
    return /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{4,29}$/.test(username);
}


module.exports = { validUsername }
