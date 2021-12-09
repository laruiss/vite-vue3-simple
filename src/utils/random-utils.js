function getRandomUniqueGenerator () {
  const memo = {}
  return function getRandomUniqueString () {
    const random = Math.random().toString(36).substr(2, 9)
    if (memo[random]) {
      return getRandomUniqueString()
    }
    memo[random] = true
    return random
  }
}

export const randomStringGenerator = getRandomUniqueGenerator()
