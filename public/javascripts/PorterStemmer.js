const words = [
    'a', 'un', 'el', 'ella', 'y', 'sobre', 'de', 'la', 'que', 'en',
    'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con', 'no',
    'una', 'su', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'le',
    'ya', 'o', 'porque', 'cuando', 'muy', 'sin', 'sobre', 'también',
    'me', 'hasta', 'donde', 'quien', 'desde', 'nos', 'durante', 'uno',
    'ni', 'contra', 'ese', 'eso', 'mí', 'qué', 'otro', 'él', 'cual',
    'poco', 'mi', 'tú', 'te', 'ti', 'sí',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '_']

    class Stemmer {
        stem (token) {
          return token
        }
      
        tokenizeAndStem (text, keepStops) {
          const stemmedTokens = []
      
          const that = this
          new Tokenizer().tokenize(text).forEach(function (token) {
            if (keepStops || stopwords.words.indexOf(token) === -1) {
              let resultToken = token.toLowerCase()
              // if (resultToken.match(new RegExp('[a-záéíóúüñ0-9]+', 'gi'))) {
              if (resultToken.match(/[a-záéíóúüñ0-9]+/gi)) {
                resultToken = that.stem(resultToken)
              }
              stemmedTokens.push(resultToken)
            }
          })
      
          return stemmedTokens
        }
      
        /*
        attach () {
          const that = this
          String.prototype.stem = function () {
            return that.stem(this)
          }
          String.prototype.tokenizeAndStem = function (keepStops) {
            return that.tokenizeAndStem(this, keepStops)
          }
        }
        */
      }
    

// Inherit from the utility class in stemmer_es
class PorterStemmer extends Stemmer {
    isVowel (c) {
      const regex = /[aeiouáéíóú]/gi
  
      return regex.test(c)
    }
  
    nextVowelPosition (word, start = 0) {
      const length = word.length
  
      for (let position = start; position < length; position++) {
        if (this.isVowel(word[position])) {
          return position
        }
      }
  
      return length
    }
  
    nextConsonantPosition (word, start = 0) {
      const length = word.length
  
      for (let position = start; position < length; position++) {
        if (!this.isVowel(word[position])) {
          return position
        }
      }
  
      return length
    }
  
    endsIn (word, suffix) {
      if (word.length < suffix.length) {
        return false
      }
  
      return (word.slice(-suffix.length) === suffix)
    }
  
    endsInArr (word, suffixes) {
      const matches = []
      for (const i in suffixes) {
        if (this.endsIn(word, suffixes[i])) {
          matches.push(suffixes[i])
        }
      }
      const longest = matches.sort(function (a, b) {
        return b.length - a.length
      })[0]
  
      if (longest) {
        return longest
      } else {
        return ''
      }
    }
  
    removeAccent (word) {
      const accentedVowels = ['á', 'é', 'í', 'ó', 'ú']
      const vowels = ['a', 'e', 'i', 'o', 'u']
  
      for (const i in accentedVowels) {
        word = word.replace(accentedVowels[i], vowels[i])
      }
  
      return word
    }
  
    stem (word) {
      const length = word.length
  
      word.toLowerCase()
  
      if (length < 2) {
        return this.removeAccent(word)
      }
  
      let r1, r2, rv
      r1 = length
      r2 = length
      rv = length
  
      // R1 is the region after the first non-vowel following a vowel, or is the null region
      // at the end of the word if there is no such non-vowel.
      for (let i = 0; i < (length - 1) && r1 === length; i++) {
        if (this.isVowel(word[i]) && !this.isVowel(word[i + 1])) {
          r1 = i + 2
        }
      }
  
      // R2 is the region after the first non-vowel following a vowel in R1,
      // or is the null region at the end of the word if there is no such non-vowel.
      for (let i = r1; i < (length - 1) && r2 === length; i++) {
        if (this.isVowel(word[i]) && !this.isVowel(word[i + 1])) {
          r2 = i + 2
        }
      }
  
      if (length > 3) {
        if (!this.isVowel(word[1])) {
          rv = this.nextVowelPosition(word, 2) + 1
        } else if (this.isVowel(word[0]) && this.isVowel(word[1])) {
          rv = this.nextConsonantPosition(word, 2) + 1
        } else {
          rv = 3
        }
      }
  
      let r1Text = word.slice(r1)
      let r2Text = word.slice(r2)
      let rvText = word.slice(rv)
      const originalWord = word
  
      // Step 0: Attached pronoun
      const pronounSuffix = ['me', 'se', 'sela', 'selo', 'selas', 'selos', 'la', 'le', 'lo', 'las', 'les', 'los', 'nos']
      const pronounSuffixPre1 = ['iéndo', 'ándo', 'ár', 'ér', 'ír']
      const pronounSuffixPre2 = ['iendo', 'ando', 'ar', 'er', 'ir']
  
      const suffix = this.endsInArr(word, pronounSuffix)
  
      if (suffix !== '') {
        let preSuffix = this.endsInArr(rvText.slice(0, -suffix.length), pronounSuffixPre1)
  
        if (preSuffix !== '') {
          word = this.removeAccent(word.slice(0, -suffix.length))
        } else {
          preSuffix = this.endsInArr(rvText.slice(0, -suffix.length), pronounSuffixPre2)
  
          if (preSuffix !== '' || (this.endsIn(word.slice(0, -suffix.length), 'uyendo'))) {
            word = word.slice(0, -suffix.length)
          }
        }
      }
  
      if (word !== originalWord) {
        r1Text = word.slice(r1)
        r2Text = word.slice(r2)
        rvText = word.slice(rv)
      }
  
      const wordAfter0 = word
      let suf = null
  
      if ((suf = this.endsInArr(r2Text, ['anza', 'anzas', 'ico', 'ica', 'icos', 'icas', 'ismo', 'ismos',
        'able', 'ables', 'ible', 'ibles', 'ista', 'istas', 'oso', 'osa',
        'osos', 'osas', 'amiento', 'amientos', 'imiento', 'imientos'])) !== '') {
        word = word.slice(0, -suf.length)
      } else if ((suf = this.endsInArr(r2Text, ['icadora', 'icador', 'icación', 'icadoras', 'icadores', 'icaciones',
        'icante', 'icantes', 'icancia', 'icancias', 'adora', 'ador', 'ación',
        'adoras', 'adores', 'aciones', 'ante', 'antes', 'ancia', 'ancias'])) !== '') {
        word = word.slice(0, -suf.length)
      } else if ((suf = this.endsInArr(r2Text, ['logía', 'logías'])) !== '') {
        word = word.slice(0, -suf.length) + 'log'
      } else if ((suf = this.endsInArr(r2Text, ['ución', 'uciones'])) !== '') {
        word = word.slice(0, -suf.length) + 'u'
      } else if ((suf = this.endsInArr(r2Text, ['encia', 'encias'])) !== '') {
        word = word.slice(0, -suf.length) + 'ente'
      } else if ((suf = this.endsInArr(r2Text, ['ativamente', 'ivamente', 'osamente', 'icamente', 'adamente'])) !== '') {
        word = word.slice(0, -suf.length)
      } else if ((suf = this.endsInArr(r1Text, ['amente'])) !== '') {
        word = word.slice(0, -suf.length)
      } else if ((suf = this.endsInArr(r2Text, ['antemente', 'ablemente', 'iblemente', 'mente'])) !== '') {
        word = word.slice(0, -suf.length)
      } else if ((suf = this.endsInArr(r2Text, ['abilidad', 'abilidades', 'icidad', 'icidades', 'ividad', 'ividades', 'idad', 'idades'])) !== '') {
        word = word.slice(0, -suf.length)
      } else if ((suf = this.endsInArr(r2Text, ['ativa', 'ativo', 'ativas', 'ativos', 'iva', 'ivo', 'ivas', 'ivos'])) !== '') {
        word = word.slice(0, -suf.length)
      }
  
      if (word !== wordAfter0) {
        r1Text = word.slice(r1)
        r2Text = word.slice(r2)
        rvText = word.slice(rv)
      }
      const wordAfter1 = word
  
      if (wordAfter0 === wordAfter1) {
        // Do step 2a if no ending was removed by step 1.
        suf = this.endsInArr(rvText, ['ya', 'ye', 'yan', 'yen', 'yeron', 'yendo', 'yo', 'yó', 'yas', 'yes', 'yais', 'yamos'])
  
        if (suf !== '' && (word.slice(-suf.length - 1, -suf.length) === 'u')) {
          word = word.slice(0, -suf.length)
        }
  
        if (word !== wordAfter1) {
          r1Text = word.slice(r1)
          r2Text = word.slice(r2)
          rvText = word.slice(rv)
        }
  
        const wordAfter2a = word
        // Do Step 2b if step 2a was done, but failed to remove a suffix.
        if (wordAfter2a === wordAfter1) {
          if ((suf = this.endsInArr(rvText, ['arían', 'arías', 'arán', 'arás', 'aríais', 'aría', 'aréis',
            'aríamos', 'aremos', 'ará', 'aré', 'erían', 'erías', 'erán',
            'erás', 'eríais', 'ería', 'eréis', 'eríamos', 'eremos', 'erá',
            'eré', 'irían', 'irías', 'irán', 'irás', 'iríais', 'iría', 'iréis',
            'iríamos', 'iremos', 'irá', 'iré', 'aba', 'ada', 'ida', 'ía', 'ara',
            'iera', 'ad', 'ed', 'id', 'ase', 'iese', 'aste', 'iste', 'an',
            'aban', 'ían', 'aran', 'ieran', 'asen', 'iesen', 'aron', 'ieron',
            'ado', 'ido', 'ando', 'iendo', 'ió', 'ar', 'er', 'ir', 'as', 'abas',
            'adas', 'idas', 'ías', 'aras', 'ieras', 'ases', 'ieses', 'ís', 'áis',
            'abais', 'íais', 'arais', 'ierais', '  aseis', 'ieseis', 'asteis',
            'isteis', 'ados', 'idos', 'amos', 'ábamos', 'íamos', 'imos', 'áramos',
            'iéramos', 'iésemos', 'ásemos'])) !== '') {
            word = word.slice(0, -suf.length)
          } else if ((suf = this.endsInArr(rvText, ['en', 'es', 'éis', 'emos'])) !== '') {
            word = word.slice(0, -suf.length)
            if (this.endsIn(word, 'gu')) {
              word = word.slice(0, -1)
            }
          }
        }
      }
  
      r1Text = word.slice(r1)
      r2Text = word.slice(r2)
      rvText = word.slice(rv)
  
      if ((suf = this.endsInArr(rvText, ['os', 'a', 'o', 'á', 'í', 'ó'])) !== '') {
        word = word.slice(0, -suf.length)
      } else if ((this.endsInArr(rvText, ['e', 'é'])) !== '') {
        word = word.slice(0, -1)
        rvText = word.slice(rv)
        if (this.endsIn(rvText, 'u') && this.endsIn(word, 'gu')) {
          word = word.slice(0, -1)
        }
      }
  
      return this.removeAccent(word)
    }
  }


  const AggressiveTokenizer = function () {
    Tokenizer.call(this)
  }
  //util.inherits(AggressiveTokenizer, Tokenizer)
  

  
  AggressiveTokenizer.prototype.tokenize = function (text) {
    // break a string up into an array of tokens by anything non-word
    return this.trim(text.split(/[^a-zA-Zá-úÁ-ÚñÑüÜ]+/))
  }

  const Tokenizer = function () {
}

Tokenizer.prototype.trim = function (array) {
  while (array[array.length - 1] === '') { array.pop() }

  while (array[0] === '') { array.shift() }

  return array
}

// Expose an attach function that will patch String with new methods.
// Changing the prototype of a native type is bad practice
/*
Tokenizer.prototype.attach = function () {
  const self = this
  String.prototype.tokenize = function () {
    return self.tokenize(this)
  }
}
*/

Tokenizer.prototype.tokenize = function () {}
  