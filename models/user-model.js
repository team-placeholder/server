const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;
const encryption = require("../utils/encryption");

const requestSchema = mongooseSchema({
    username: { type: String },
    email: { type: String },
    avatar: { type: String }
});

const friendsSchema = mongooseSchema({
    username: { type: String },
    email: { type: String },
    avatar: { type: String, default: "default-avatar.jpg" }
});

const defaultAvatar = "iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAIA" +
    "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" +
    "MgJhwhkwyxB4PFZMNTEwbPwMq4hilNpRqD969G" +
    "TYpNnv18qWffM325+EaBaqQRI8tbPbrfp5x6tSERCLLghzjGXmf69K+wybaPZ" +
    "U/CELh/yn0iz/TLkigTAxY05PGj+dlTmNMzRxzkKRAZaZ" +
    "uZjV/dMjkciClRs/qd9E9TlvMA1D/o3qEt9hLg6c2JdNO" +
    "v967LStNmt6RR6dwqcBIyfBD5/iz3T0WjjpR8lIyQiEC" +
    "chNE4fVGxozdR4/4raSp/nFlRt3Mtv1lK4PKddvtj+udBf" +
    "CSscywNlqaaH+wycUFT2XmSHeLAQs9f4jp0imgUCdx" +
    "nqJIcoVCYQJ2w8MVOXH3Tz9PYaMwwTMkMUYrEka0Z+27f6gVg5zgOaxRi0Z9FeV39zhhkDUwYAx+36m8e" +
    "gUGhL1slqfvXhZN6weiexqlJW+bNdzEFZi5" +
    "SwVj0gpFiUQJrIzRCpmVtueL0tfYTUSIz" +
    "wIP82QNGKMn7GAVWu0dxEkHHVCluLNFT" +
    "yqpGosngxb9wg5gy8qqJX9WZCO/rx9j6Nv" +
    "iYAsfl6S3rid5J3LLojs75MRCBMPgeyMfvZls" +
    "9z7j6J25icc60ip3nvYOJM+amJPA5B4/JnoY" +
    "Xgp9c2e7DRWksFw15vByKI22QvhD8Pv+kIL" +
    "lm9QKqW6ROLV63c+rZOTIlJBi1VD4SiBMDH" +
    "DUQAVnNFf9h6KxpBUoCHedcAoi6spJuWVv" +
    "p/2pn+ekMdXjhqi0gYM8dewQHr+snX2/JVD" +
    "cdXmfe+mpnt8Fh+ARpwIhBVvzMOErPhTTCT" +
    "B6ew7dJxtvkFAEUYlqkrtUJYNJuD7WrJhu52Jy" +
    "puKnXoPlX6eV2iITEMgrFhCNrbjZe1RhpGffdn" +
    "EPomroz9ctPonVTgUZ/YS0JO/l5Zx8LczIou12vj3" +
    "Hjz+sE5DlNiwl6DICIQV1Q/0iZlA0ZNAf7hi/RZR7Ze" +
    "pYOTE2YvvpoXf8WXKoktiHuIUM5YOwH0kP/+hg9YDkJy1aKWYS5b+kA4DgbDiCjD2B5oZnfrCWvOu" +
    "RgRdX0SCsKC4pG52azk+iwwys3mQeDkVj6t94eZf9cW3" +
    "oI5flL4qqZnTQfJUacSJQFjRHFGvoGUqk3hbdx9U6xnY8h" +
    "40zkwFQcwihXlL7Acm9OijGXNmLlv7s3gjMiyNrtq03fz5" +
    "U99kM5NASL+FfwZCRZc+o3kXayhJJIRnf/8TsizB4QwJ6nP" +
    "ibmvBXiK8r//UbQikVlXhBqLssrKyGuHWdm4QGYGwg" +
    "nJCzmNmRU50C2s2bbP4X8IfNu7cn5PF+GYl6A2mJ2" +
    "ZVhrvBtKCMSweOnhIrjgFjhxh7wz2FTgKBsIILMwxIJ" +
    "sEFWNGf1msC8+/22Vl9/9FTWIAxJ+ulMi9XHAwn4CgQ3lyku05J067fy" +
    "Re3FR6UPioorFYzEwNsOgkEwgolapvnNeQRW8pGT5" +
    "rrUI6A8K1Rp37sTAfcFGaLYSVkFPQfPVVWRyX9oN+Iyar8Ph" +
    "mBsEI69UElxzNP7ZmLVx0gPPv7lRTQ8/W6SY7ekjz08+SwWo3Qw6fPVEUM+DA9PBVmCISJ0KIQhZlAnZx2Dk" +
    "0zCN1gSojL6bqnn8YDUVWJ1BuYvXiNQ/0NhPc/T29Kk/" +
    "UEwkQo5fMkasKsxQ4F3uKXrz6u28AhDOGWm4scWTI" +
    "rSf7M+o062iU5zOLTd2Om0xkgEFZ8X1uSZo6fuWC11Fg" +
    "VY/OOvTxv9GvuKuUrIsWavMucuXjZcvVswGLnwcNEW" +
    "yMQJkQhER6AiqG6I8ksyESNngPHorSEi6oyHvvaCT6Az" +
    "7zihNkLokJrGIulhUXPqEVBIKzgwypneUDJ174uIgJjux" +
    "CLVlHGiFzmCb2OPcHBYItuDnF9+K9h+550EgiECVHGm" +
    "LtkvSgeoqcoO3X6vHCV7quOihkRdQDf" +
    "fBcPHuRFhQgN9gzHzFhAZ4BAWOHn1STBHD123DE9OHfZe" +
    "jkyy0REk4DorG3Z9ass/mJyuHXnfjloL4Z9w0RnIxDG1Q1iU" +
    "vT4SYFavodPMP9qTx0DSfBmQZBfvE0OxT9v5Dp1wUm" +
    "CjUAY18QJmGheDdjMsexKn9ZMUtuSo4QI76JJpz6W7" +
    "gVvFkY/gtTXrnZBICQQxhWEYLAa3oHAJ0+LTA" +
    "+ZGrQrWbgehB/VybEkSbmKfjSjZXfHaCWBkEAY" +
    "VxBCh3DQmKmO1S7HTpzFiTuxYCwZOJaY5uXm5cuIF" +
    "N9yt29HMSHToKB9a4RDAmFcCzNw7H5Ytl6VcoKP" +
    "dT/vkDMWUm4wOXLgoyfPyMIMjlSMnTbPEm5jJ" +
    "BsPyV4QCONZMIRjt33XIQcIp89fIVVY3risfcXed" +
    "DZs3cO1jMWKtSWrN1mBKC9BhckTEgjjFp6ZIDx8" +
    "/Ky1xYHVDYG3LWRFg+4ijv4XcoI3NGPBSuTlRcQuJ+hSqCBknpBASCCM" +
    "Z2HGG7z8xzVHYaZDrxGyMZg0tQp8syMnzRGq" +
    "AXxc69DRk1XtW5+oT0ggjDdd5n7eAwcIG3bsCyDEFiIfSnB/joRv" +
    "pPfgcYa139d8cOHyVRWEUp+bjEAYr+qoL+PlqzLDkPJO5rmEvX9yTzUfz0sKTwifO/QcrCzZNj9u38tXNLkzaGkhgTDenvCDWlkONwjH0xwj9No610njCTNbdXO83+cvXqrxKi2oIBDGG4S1stpaPpB9Li3TU0SvTOaNS" +
    "eMJq4daxbCDou/XyDJfk8a7hZQTEgjjZ5D1BVt0t4+cR" +
    "x89LhQdQqlAE04aEMJa71gQfvpFY9XbUz" +
    "hKIIxntTAQbv2NA4S5eQ+tOSDuA5MHhPA5BoN6re" +
    "x2UtSYQEggjHNpVGvebaBU+sU/Lv95Q02NkgmEbI93+OWLEvsshV63YUc1FaSckEAY1/6Eyt42WPP60pUbSj" +
    "YY8AhxxOTwhGBFRc8drjC7dQ+1QEo4JBDGFYRdB4xx7CE8cfqC0pZIHj" +
    "Yzj669weLiFw4QZrX6xsFJIBASCOPnGWJ" +
    "BePzUeVPE2h9SdSKS5v0SCAmECecZun0" +
    "3VrYoEITnLl5JytjsdSCEtw/hKIGQQJhAnh" +
    "BzQhsIk2KyXq6IceSECEIHMYhASCCMnyd" +
    "s22OwA4RmddRvO7WgYJ3cOWFmy69VT0" +
    "gyMwTCuHrCVt2/U8NReHz1xm2nW0gOj" +
    "RnBgyktjTg84ZfYolAWqhEICYTxC8+yWndX9k/ovFnvt53aKt5Q0tx03queGc" +
    "uYqZfdjnJCAmGFnctAs67KXl7z4+nTp9DRxsgtadygRyyoAIaajR/EPj77sp" +
    "mcYII7DmnjEwjjdyjh2PmDLRwgBBlAqUdqB" +
    "mmoepgEzXoGQiDHOGJR+Gyb5WU0bjoe" +
    "BML4RaTVaoQdUmvw8XG9huo8gdkzdP+5ZFlfqEGH" +
    "Po5YtPBZseTK2spRdEIIhPHwDNC" +
    "U92bAQJ10C4jGeg07OPr1SVOY6dxnmAOEt+7mIX" +
    "tbzhMSCAmEcQUhPLh++67jXDbr0s/RpUiCQgW+Fy6yahWEo6fOX1LDUVQ" +
    "6psIMgTCuBcPfTp93gLDPkO8V9bEkme5BjE2fv8zx" +
    "Zrft+VUu9xU+kNTWCIRxdQ7hzTv3O5LCcdPnq+fSk" +
    "0Rqaxu37XYkwIvXbJJ1UbH3JkwjhQTC+Bgqi4YWLF/r" +
    "AOGKDdt5bJZEnhDfwtGT5w37EDPecfDNMhBq5uK" +
    "NNOpSEAjj4xmYDfx+GpceM7dkm2ySIydOg1uQiyiq" +
    "JEWOhG/k7t37hiI6Ch+d+o9J8SXP2yQQupDGlRZq2W0A" +
    "7ugVK2yjd/MfCZRqHrGUIgne8od1GooFjBZzLb1pF4xCVd" +
    "lfqo4SCOM5VRDCfn3U2txn/glbxFjrLABBGrQxkqM6GtM" +
    "kNLmy79cIy6aoo2RFRiCMR2kUHB10yYqeFxt2Egl0" +
    "KSzGjDeQHIWZAWOmqIEoPL51+5663d7RvCEjEMYjHDX" +
    "71N7Qb6fP2UszOmyWRhAC" +
    "jzRFqHG73RMuWfsTrmOSbcLtuw8iAgmEBMKKwqGG" +
    "VcEFK380bC1sfcPWXSqZKzkO5ZmLf/Ad2eLNTpi1WBao" +
    "rGFCAiGBMJ6MGfSHvYdOcNCagUbDw1EAalI0rz+snQ" +
    "3i4srKjQg8ArE5uYZRLT4RCAmEce1SQMoHG2Bk44zXD" +
    "6PRtGBrbCcmxzxhi6++s1PV9Yge/fzLJhZVnQozBMIKaNabnTEz34Os79Hjp+" +
    "gkZBut97BxqvSou3Jd8zPf+Ml/+ClzF8uqDN5oLl29TseA" +
    "QFjBIESSJN71N+/YK/sTeFjX/v" +
    "QLqnS7q0mIPzMSX0W5xfzy5LnL9tJodOm" +
    "6nz3JMrJMIHQ3YwYxNuT7mbbJXsPcDJPiD7" +
    "quU8+CZ03KAiAmU9ObRvSoA4Sd+42ksJNAWMEglJV" +
    "PsDo57Q277Bp8NOnQ04" +
    "3yFlVSNUnCxri034jJvDkvaKOASdjQRCA" +
    "kEFZ02JZmFQbh85Vrtx2zdotXbWS0Zpftor" +
    "BmAhnN4B1f6Je9B/HOoovSzNGTZwVjmw" +
    "4DgbAiT2pA9ioAh7MXr3Gkhbl383F5vYtAKE" +
    "udplIOJLSp2if1G7169crRgxkxcZas3JARCCvME" +
    "1ZljgKdBnwZbtHdkCIXguLc7puBrmNvq7u+w" +
    "YZPmKlmgwa7y9QKtfLQKkICYQWfVBaMYcq" +
    "EJURA481bd2xpoRHdvveIu8I2Xpgx5z8yTO" +
    "1GX/jC5atquguPT527WJW9DCJVOgkEwgqf" +
    "olBU1XyBKQvXsTEfXTYMI5FSr9YcBym4Qc" +
    "2DneCE7ePjEBbKq2W26uaY4oWP4RNm" +
    "eZJF1JhA6HoCt+U9TL3NQO3stlJzzRC9ihkLVr" +
    "J+miY1SBN+Z0NYDkP+uMWmZwFv5+XL0s9B05HqogTCRAtN" +
    "JQ73HTqunlp4XFBYhO" +
    "OFHmvalbFtWOE0QT08y3JrZrR8VRpx" +
    "TGlt2LpHTRrp6hMIK5re5bWaadioaN9jiEp" +
    "ew88TZi2q6suq6kuvwrEXwHJOYlZNTQSyn" +
    "3PVhi0xiyf0zDY9PEkk708gdHl11K92t/ljaEjA" +
    "djSlnGg+KCgu+bR+I6SwSR+SsKVFnEWun9O" +
    "+NFJmd4P6sRO8PUggJBAmCghVbyZ3MAF1W" +
    "43fEIfL1m9Gwjcmh6jenYB9NtRxhAe7DxyO2u" +
    "NqeCMgqKNksxppyRAIK9gqezWLvCYEjuDLd" +
    "9My/rh+W840IQjLIkbDtj04N9rPVztgJyDBYlHN" +
    "kxrs1HOggTVeQTyAkszxMxf4qlCGQGoSEggrvK" +
    "MdwB0Mcg2D7BnCM1/1H+ZcE2NEf796/f0a" +
    "WdBbS2FQfMeXoAnhR3Ub3ct/okqqoT9v3LE" +
    "nUNIxXfR406GLSMeAQJig4MSs78jpc1yRhYPQ" +
    "PNNzlq7D9iDnlMIrU3HcKaCSVOJQdUTaHf4YL" +
    "DDmtRa4g6zfujsqFBwNJOEZ0U17DgPwJD3IIe5" +
    "ERiBMxP5hRvMuoMZiBqWGjXXZvtdQxKqEnOV" +
    "LcY+aP061R7bMNKC23eH/23/4BMMiavPyEmyeq" +
    "hVugdksDjdxt085IYEwQT0hh1B4xsLVkAw65pu" +
    "ePSvWmnSRi8QUDg3WReKkj6iu8oY8EAHZsF3v" +
    "V6/KYjcumnRtJmmFsyOsxRKkiV4CYcIaMirNA/" +
    "pezfDlqzeVASA+kHfrdm5qoAXmVBgKquMLcpj" +
    "93wahWOsZAJoBfIa1ijCILDSMdQOhaESOnbpgL" +
    "h72Zwqhe42Xl8gNEggTe8AixIaYgsEW3UtKShSJ7jL8" +
    "49LVPz+p21g5xxoPUH3h+MSi6Nne4aXdQO1wm9v3" +
    "8iUC5YMnz57XzGyN8FN7m5xs4KdRJgJhQiJQ6N5r" +
    "GO8NGjUlwiGIyrmcXnrl+g2f1gyQAC4RB6NS" +
    "ULcmLqvF2LRu0OTx+DPSG3W6dfdeVJHyZ/2JskjE6" +
    "NR7qFL+lQ4wTj8kgZDsH9DZxD4mxNXCVRsMWSnlc" +
    "Z7pG2/dy9eadkIZb6SeirhUi9PNwhts1qn/w6cFUfuuJV" +
    "wvNWnWEgY5TV08bPX000IUkRIIExWEyppenFp6Ny0MBB" +
    "TDqngIFV0jWlTystegMaxtKNmk8ak6mv+XkZPmvCx9JboR" +
    "PBDFH3Ht5t2KiHi4imhOiA31muTWkBEI3WHVamYePn" +
    "lRkjCVJU7mx6atu1JNcqmF4RRRm7GactYEBtcytahzfl" +
    "u5hfcP0ExlVE3+I5KfDUnggSMn5eijY+fZll2/vpfGh3rRGdIVJBAmQesi+" +
    "GGdnMPHz/LCo0Vq417o0dPigWNnvFc905rM8KvuU" +
    "eNfWuiSkxwB3DljX8yi8blhxsaW3AAA5Ie1sybMW" +
    "vrsxXNLzFfQCfDBz7sOoVhjCgI+LUTzuwTCpCjYsHDu" +
    "vZpZW/YcUQXz7Txv/drNuwNGTqlWI2TnzYQ5UU7hTFv" +
    "uTrySuztvyF7M5PADAH9Ut8HoSXMfPHyqjFnJcmgZwnH" +
    "5us3cBzI2DwafFHYSCJMqVwTHMnvJOpmEyYqIpHoDLB4" +
    "8fPzD8g3AuUGuJgeS0tN3JI3ml6nKM2khubkN/WGTDr1Xrf+5uLhYpqP8f2dYKzRASnT45DmiEZ8hXShdOwJhUkWknLHpz" +
    "+jSf1RB4XOEYCQaNWz7ZHQZI964c2/lxm29hk2ontlK7ZKrC" +
    "8kcuwExFgWf+UXjTn1Hz1y/de+9B49FyudUi5GqF" +
    "fCaRp36ePwBRiHgMvjmP56a" +
    "7qERXgJh8iBQlD0RPNVDLfc" +
    "fPiG9n2F5Rd3CpOIqHz4qOHX29x+37Z" +
    "s+f8XQcTP6DRvftf/I1t2+hf1k3b4bCyLZQyfOmr" +
    "V4zU879sMiwacFz6L2aic+1qOG+o+zfqC+cdvez75onMISSCFClV" +
    "FVqFF5SMaCQJgkIPQpHgYdi9d0Mj" +
    "0GfX83/5Eal+oq/BCduuHQ3nWKThiv/xbqTTHsC" +
    "Ta5LtSo9GvXb7fpPlAmjVKkg1PJvUHGaKPqKIEwiW" +
    "JROT9h0VB84f/Uzh4/Y8HjwmeGTd1Ttxr7iitzos9" +
    "Z3XkdPHUl8zQ/7uc9GjRmqlqMRSIr/Hh80sqPzjAj" +
    "aVYsEgjJyjdG4DYrLrAKF1rnf968o/brHNgz/gfUxX" +
    "xXEAN07lLPXboGoSzwB9DXqfIcxIAhEL6N9k6a6XP" +
    "e9QflDFSLLv1Xb/zl6dPCv/BrsQHna9EoYAyll3nLf" +
    "wy3/gZ7G6xwSr9/AiEZMmCExKDKik6pntGwY+" +
    "9p81ccPn66qPiF5QD/0vWpnyEPfPK0cO+vR8dP" +
    "X5jR8mukp9IgEoGQLMbEbDtKCTK2moZabJy6" +
    "CSxwfwiG/b7qN2rcjIUr123csefAb6fP/34Fqi" +
    "p3oaiTm/cQgthLV24cOXFm6+6DQBYfNXluh97DaoRbcWU3MQ6P+mh8foJA" +
    "SCAkk9RQdTrBEhRWVpTJSV8pYKMOIiovt" +
    "miiOINbxZupDgGqFLbyS0eETALhW8uksYl5" +
    "i70xluqMXF6t8NHkA9Gs59DC1/NRI0U8St1g" +
    "w+JS+uUTCMkUXijXO8M2Rhov0ghAaiKSDFjb5O" +
    "1ey8ahsYsRw7+MNRg5l2Sfycig/JBASKaprk9ya6SflLRsFTyqG3Q" +
    "uafPbQlzRf9fUMUIH8By4JSMQuqX5HnKO8AleK" +
    "MaQ6jSDpTJqilnI+DMxFbh59ugRJSIJe2uRhjXs" +
    "Wz4tgY4HgTCuuZysbXJBTtYJqCw22n9QK2fCr" +
    "MWHjp2AumXrzn35/k0uAxVKQJkWvI9kte25b" +
    "suenXsODRs/E8avTCFGcROpIvZJgTGhxCDhkEB" +
    "YUSC0ViyZfQUGOT6DK/xek069bty8LccXYFaoTc8" +
    "hOKELi5wSdjFTq64DIhFz3zDSdn6/eiO7XS+54ZRl" +
    "mGFHYllupkpGIPzXuaBqkCYFOfGZj+s1XLb2Z" +
    "+RJKxw0Hfp7TKosHeUGE/DIws9/9MRpOwVH" +
    "jxj6/BXrYSRfBNu2YNXBfaOzQSCMa1oo9H" +
    "AzPNYcUEaPwWNgKjdq0/vVUWvt1t1cPtO" +
    "UqG4Qfrw/c+8LkmqZkIgzSad37j/oPmA0" +
    "zlVgrYh6jATCCuV82kdpTf/g09Kbdjl68qwkm" +
    "MmJIUEt09du3unhSyCCibnfD97Uhu27lZ+Zv5" +
    "Go8OcHj576ksn4mz9/aqYDhwRFAmGcq4hmK" +
    "og+wac1X/njVl3X5fIJdUMoHmZYjQYvU1kvCTk" +
    "sq1UPtbp2KzdqlKn7pKx3pBuQMS5dtyU1vW" +
    "mKL0AdDgJhhTLOvFAFDX9QO3PynEWSY10u" +
    "wRo2hM5atLJazWys6HBeaEJqRmAJFEYcF63eGIkY" +
    "Qo1b123qG6YVPn85cfYSKP8682SCIoHwTXYglL1l" +
    "jucBQjCSN2D0tDt5Dy2PZ9hG/hCTpy5ezWzVzX" +
    "VvHKxx+x5Xrt12DEZZU8Ls0b37DweOnpxSPYw" +
    "ipR6fbXuhpKqm+B3FG6uIxV4QIhCSWUfHgToh" +
    "Nxi06p/ewLvVswF+t+7fxwUvioJoGYajuNPo2bNn" +
    "Q8dNRw1Pd011SOLO+7WyJ81ZattpY6gj/6zgFNXv5OYNHD0F9oSb/U9vh" +
    "pRIVPr7IeSy2uQY00IO/jqB8G13fdj44vPmJoczJJYW" +
    "cflNuNnDLR9OG5w5ZeGZQ7gsiqowMHLkC7bAf" +
    "8Fd8hBq5RNvRjWz2m7fe8gwYgcadVU7GPY69R9" +
    "tSmaweDtkz3jDNg8pNgXg77mKL0AgJGOHhuttBpA" +
    "zzQnT4rYNadKIibNz7+bLYyfkl2xohIfHz/ye3eZraNwjh8Zda6UlhRXDSxThru" +
    "zPgmfa9hgMU4uyTmMVbCI233j77oPhE2Z9UCdbMM" +
    "4DaB5FwU0GGnbVcAIhMWDYllxVZx59oz/YYuai1Q" +
    "WFRVyPkGmWsRa8jvJlbIeRCcmbufd7fDcKtZI8Qlh" +
    "NziK5i4qgiv+miJsReK3+I6fk5T+2KylGFVjyLx" +
    "8VFM1YsNLc/WZbexqWysIe" +
    "OQzpf9t1TQmE5WSGeGjg5DXo0HfT9n0vI9b" +
    "qCEuc116puP/wEWiBvp+WjXunUUEQU" +
    "yx33ekVLl4AGzC4PtH6ri9crXbO5LnLiopfC" +
    "kqQqqwhNVThDhV5GdE37tiHrDf8rSLPFm" +
    "X2VXASCMn4WAMMpMODT+s3hC3tF69cM" +
    "6RamaEK5lohKHwCqcKJsxaBVpqsalhDR" +
    "nzroMvCUY/QZVTHiD1K5RPjSVgjNWv" +
    "RahOKKjWPN/cjNqk4I3r+96uDx836qH7DFJMLHuBu1k/dRQK" +
    "hvekHZcz2PQb9tGPvy1f6axXjlTDsU" +
    "UHh5LlLQbtaxm+V/c52mesSHjUQd" +
    "QaN5VWMP6/XaObCVYXPX8SofYu+" +
    "omG5yhcvXsJwRquu/d9VOhZCX5hAm" +
    "BR0ajlC7hHDso49DVX5hBEPgfA2D9" +
    "gDXbMlqzc9eFKoal/bqFtK7AmWl/dg+" +
    "DTT+/FqqqVPEX77cmnzlwx3ohkLV" +
    "0P7Xo0RXqvBaETzHzwCRnh2ux4IeEd" +
    "/UmTRfAGOQ8hDXE" +
    "QCYeIh0PHAmkYVN3VedBH1cdja2a7nk" +
    "JUbd8COB9ud26l7LfNAsyV4/dY92CL4fo1" +
    "witAONId3fW85U4T/hiGM/376fBA4tVeMbbezi" +
    "JJaw2dQi1u4alOLrv34hJQgoDLUBWBBjSWT41" +
    "UE45LrZlcpORBojuc5oSiwx9ZommqCrGkOO+" +
    "LHTJ138OgJ0YDWLZKnIWSqbfLVEZzl2XPoOIB" +
    "W3KQ1xzivY2Pu20Ut4kqN/LcByxX7DJt4/sJlvH8" +
    "Z9rU2RrQ0pqBqfhQUP9++7+CgcdNrZbeTs4soAynb+laoTyBM3Ok+RZ6ML2" +
    "DxprM2V/jjL5qMnTb/6p/X1dhSl3MOscmMu" +
    "IUXFJfArbp+TnvJb/ao++hBWdBn9fffztwGvZY" +
    "o3oRlxQXG8zf9sr/kZal1XzNkqSbCFYqtdVTsYj" +
    "BMnr5w+bsx0//Dal0p7DeMSxqVHlI6gTCBzFIE" +
    "jFEuQkx+Ur/RzEVrnr0oKTdRUW/VDs7n8XOXYWUK7" +
    "LgGF4qUa0fqEuv63kIQwm+G53VpMkYw2Q5ipUz" +
    "w0y8agxgxdPmNv0gUrYQ7IvdnPCwomjh7MR" +
    "DEuSAyb1oieYA8YWI7Q4v54c+ArX2PnzzjdEd" +
    "D3onFkrCY5UfwPHCv5i5dl96oUzmos3blasrMg" +
    "RUSv8V6nhpbJ8oTNibzoUnNxaosbc5p+w1MZjx6W" +
    "OBcliiJ7zIY0eWdUYeksdu3o4TuI6ee2tYSEwgTB3tywwk+" +
    "4/2i8c4DvynLjDDrizhqMPLjfn7e4lUbm4IWE8sesW2I" +
    "ikxSTsYqtPqtar7q/d5CT6iysWWVGGVU4YqAy0LdHSn" +
    "DA+RboL+t/Wn7E7HxRuU/WNGpEZG8QOj/w+bTj+s2EP" +
    "vbwkm2L7FSkiWE+MwXTbreupunEFz08mIhnQ3a3gBKWo" +
    "N2PawjZXWoNV4Wx1SHFXg4m5Q9ox5B8fktXKaJHi9sEy" +
    "AWsaglRWPJ72ucCu8Pwf4puPHdZGoaNv6tvD/qFk" +
    "Pizxu59XLawF+snHTVr0rJcTNWVzKEW3R/WlgglVEMI6rO+8EHDOBCRx44kP5gcwkkoitUSEsJH9fO6Ths/IzdB46" +
    "+KHmlVsWitrXh+uPHT0Otvhb9WE32ZpWqWJhAW" +
    "GE0K6naEmj21ePCYkPM9gkARvBCXr2ZO2j8nI9rZUlalrW8mix+9MCgmkRYubcv/Fn9puOnzb9vDmqWw1eCryCIrduwIyYCKT7N" +
    "oqS6ORFIgpwwBBnIOz5QHNJA9QQGvbHf59gRXfS8eMSUOR9" +
    "guyktpDIw2DAb7WSv+JYSXg64n8Ik8dQ5S4HjFrufGIKbG7fvf/Z" +
    "FoyppmVWhFCSX3tiGMwiE8b6c2KHSYHwWhMCkxCBvvrNE/8" +
    "TZi2mhNqriNWkTJQi9STpG7ENY+gZeWMnY7tylqzIWVRkUv+" +
    "w/grul+OYc7Akzx0ggrKjpG/NKfDtqKkpLyL4wtuO37DjwXo0cFL32KL" +
    "xkkqyt8L6u+mtHtg0PSdgsC1RTYWZq274jcnpaHaXuN2z8//NafxfLP5" +
    "QTVhhxES6AV2v9vAj0ziKGPZXYsn2v2bbyI68qrDT9NApBK9wZqlC0R" +
    "KK4MBRfXQy6NTv3HXZkhlFzgqz48/SmVlXWG6ziWrUo14MQCU1L" +
    "1/ykltHwOl24+Mf7NbJg3Z85nOrLYj4" +
    "wgDdj5hU5O1HcgwkeFdNPEo/lBigNVw" +
    "7LxgZQ7S//eU3RXOTziotW/8Rxy4LSKlw7g0AYd4NUsG5WO" +
    "7bAJCqmS81iTGHRs1pZbW3Bp1+55GmhchUN" +
    "yeJTHS2Xb+jkxLOmPw5G123Qvvh5SZRFOpztFI2+LH2VFm5pUthS3T1X4RoQSuU86x7p5fu6lqze4Ih" +
    "V4GPQxB9SRCtJaQOSx3NjExgkC7JGTV+IxTbdsHj" +
    "2C5etwYJqCgpn+AmE/271hQ8oyclAFnuYsUrhs2I" +
    "Rg/Jrc/nqTTa7HeDLOn20uMvdGQdg7L20IIjzG0qRFB4+eVpUrYbkjrs1oqnkqkgm4FgWC1DsM2IS4k+NRb8eO" +
    "EqtuamKl3SmXRe+mgGnF9jh4b5Dx8XSD3sNGV/Zq7n" +
    "6ylZyVS4RUHRpzZEFeOwonaEaNJOCtub9VKoxHWu" +
    "XdqHgM+wdyM3LN8TGK3SGO/b86lHkUgmE/24rQno/" +
    "JOkDuj6qk/Pq1StDGdCGj+nzV/DxNn+GQ8+LF" +
    "NddmROaA4ToErNgr45D7BToph/UyiJPGG8QInU" +
    "QYNbum4FRWyvXfFwnp53c5KxeG3dJD5JZ8YvXYhqmN+7gVByO6jAb5eqbrMuqo1Zex0gVc5eusddF9cvX7uBkrTq" +
    "Si9VwlbZG5q6CHL/tsgegteVQoIQhbN4tpOpoHC4GVxlhz" +
    "Vn48uiZ86oyBXyG2W3OJ/SG5ITb2z3v5/opGUwIJZlGdqQ" +
    "kMePYqQvmeSAQxheKeFMMFBe/cEh3ffXdODq4STj6ZAnm" +
    "Z3QfPFGVRwAQwgo6V08zVXJXbiA/wzOQ+0VVAXb2kZbRwnx9WoiOb9IFpRqm+jUzWzsFogyjdnZb9y" +
    "b8rgKh3xJjh8+gAupQQ3ha8Mzs0fupCpp0Zt5VhdKPN/Cs6LljqqLN" +
    "N4PIE8YJhMovWhs+eY5DNOb0uUtM84v6gclWH" +
    "eUFOTaTDV+eOn/JoVs5ZPxs8oRxrY4i1x5qYvZS" +
    "dRTWmFE/MCm5ozaV17QQiK85giA4DO6NgNxTHf" +
    "WGHK2/NZt2OFRI8Ep4xGYYsuQhcIv7rymj6NV+W" +
    "LbeAUI4DO6NgNzjCcUAhOwX7Tl4zKLzsj/GzVj41u" +
    "9mScpwNGA5QzYCChfaJpduGKDURs36eDBmpEvE" +
    "S4KJgbrBs9/IiZJQT5ZMdVErLWQjS9+OmOgQKYVy" +
    "gHu7FJXcdT3kxYDPN27edhRmOvQaIV" +
    "9Gxzdp+oSyECA3THbqM8oxPnr9xi256pBA+O9eDDV" +
    "Hv3c/3wHC5l0GUGk0KZ2hOgoDHq9l14EOEMJhUCZs" +
    "CITxAiF0BR0gzGzTg0qjSciY8WfYGflauPU3DhDCYXDv" +
    "qFolt6UHVoIOi+8c2Xl60y4Sq2TJ1qWw5H01uNCOPuGLlyXuvfSuBCF2" +
    "IBxrleADuEuUEybxIIV8jIxFBw6pRRFX+iheErVNxJa" +
    "8Gp990Zg8YVKC0FJkY1f/8y+bxO63c6+GUCX3hSXib" +
    "he77PXT+o0kVunsJlNOqJ4BwCRs/429+u59j64EI" +
    "WIs9jKgJ6TqaFKGoypvplZ2u9ir71" +
    "6alLu4o2FUHEGRCztbxvwjNdDMvTLMZP8lDRF" +
    "7WkF8rU5O+6iqa8Ie0BRFfK5ESC6jA3PeCY1o7Zz2TIomQAc3" +
    "+cJR2QOEB/UZCA27tIl7yVLukrfgmvaoFgMrBx0wz" +
    "GjZnTS2k7ZFgfvJWeEtu3UPGwh1A0TyyRPGMRwV" +
    "1er7eQ8cIGzcsXdVL81PJCcIpbIJfNmsU1/Hpc9/8M" +
    "S9BTmXgVCGKPD56o3bjq11oIAo95/R2U22PqEyW" +
    "Ni+xyAHCK/dvOshGfw45YSghA+bCZiE4ZmLf6gJI" +
    "aCwz5DvEYTUKkwqEArhPLnhHDaEOvqEsNPXvbU" +
    "Alwk94SQL3vAO/HYyKhcpsy3Zo6fMxeINgTCpS" +
    "qNyf6hgLI6e8kPUPtB9+PhZnHgiEMahWaTJKtnGbbstMWbm" +
    "CecsWethyyIJhMkEQrzi6Abx8VycrFe017ftO" +
    "oCr8giEcZpqAYNdWfOWrjeE4h2Dof7Tlj34LW" +
    "gl4ZJXx2ZmOtOuM7yUKb4Awi+F7fH9ccteuNyqw" +
    "NDiNZtI6Cl+HEI54jli4lx+OxST9afOXjGvGVdi1liSoK" +
    "mRDHlI11mKDxebB3DxAR4AEFUwRDiKt+BxMxa4l" +
    "yzlqtVool+EIGzz9RAWi+pS5OJR4WNzjy/sBvVaf8UO" +
    "PyLTuJC97UcHyJXw4eI+ffrYVpgB5fVvR3pIYyYelsaro" +
    "4guRiDUDSUziET11C+b442zqllEzeQbKdg2GDrQbi3M" +
    "CKVDLNKk1m/kWEACxyDYqjvtJ4zT9UjhhRkNnWFBY" +
    "ZFVmGFXo1vfUSnesLnb1ZYEaohbfJ7MVbS1QFXBGcY" +
    "4qEPvIaIuypPC0tLS92pmUZ8wDsYCklSNNQkDONq7" +
    "78hJsY4AL0dZSVnpgpUbYaaJd5bslVJq4rsPhLy6ZhKG" +
    "P67bYMaClbAVVIIQneGFy1ddzZRyocaMiS7uCcfMWKC" +
    "Mders2pjRaeHzF1N+WPlxrSyTZcrW1lN11LWFGfOGC44O" +
    "msCPHhfiJbYKAez2u3jNz5JXTCD81wszQnRUQ59Wr2EHf" +
    "j2YGzQfYISiR+CpB4+fjZo27z91smLKM2SusXdrZH43avL" +
    "dew8t12fY5ifgcbvuA5CkQeFoxdjeA0cMa2mrLiNT6SEfP" +
    "CmcOGvRJ/UaqpvrY9fZi3hVE/4WeTlUTf1HrGucd7E2aom7p1" +
    "yt5VH01GwhqC9crUZoyISZuXfvW2Ojhk1UBp/5/Y/r1fxmE1" +
    "/mjQTCeNvH9Rus37zLTmLSRcquy7ShqPjF/BUbqodbc31" +
    "Yxq6obHOPNqqN6njJ/paxXC41iO0iD8NVFctfabzpJ5jA" +
    "VfkgqInSzwNNpsxb8uDJ01g1J1aBixi8FBfZdfC4N72FoLPRZ" +
    "H2FtpKadu4LFF4LfoY6cR+RHrKsrOznXfvhxQqfRlNRp65Ap" +
    "DTyHxZU+CYza6GSZu0Y9HN3J1lNDKvhYIvuqzZtf17yw" +
    "rYENKorBDXekrp++27nnsMYaDW8XRJjpmLDHg2t34jJd/Ie" +
    "xepwWe6R3UThj0tXrw8eO+Oj2g2VqQvzNMBRsNAoCD" +
    "dkf7OaLX6T7/hCYLHKhfIeB4nf19+NOXr6ovN68UupAFI3Hhc" +
    "Wj5w05/0aWQqzNJwCy2F96cCqIRBWZNkGL" +
    "gBcj2o1M0dNngN5oLrW3H5XxYsKf5S+ePFi7eadjTr14+VW" +
    "f4ay9iBUVZRVyf7+RZFRBuNLSKkYmSsGm3VetHLDk6dFaj6" +
    "vFNuiakIIC3qnzlsBjQqPN70qK4eaGYTpAzXoXblX2cT9nhDr" +
    "pdjASMPbrfafWlljpv6Qm//Y6QwNK7sQl9xMGm/czJ08dxkol" +
    "1RJzajKi90a3sIJS3/PzF9dmixuWWuVMGj0BpqOmDj77IU/bPdH" +
    "Q1n6ygNQHogCK2PWotWmmp55ozTb91zvy29LJWgXRUXOGSIrr" +
    "aqYeTFp3P6M92uEB4+fAcmDrZfIOhmx1TZ84syFS6MmzfY" +
    "Hm4tFXGT/3Bm" +
    "a9RgMFD+s07DfsHEHjpwsLdPlFTBsS8" +
    "50hJ+Yj4k8ePh43PT54P34RC+mkX5R+BH5SF" +
    "VeaaOtTBVXAxB5Ob8YGExivgfZQrd+w46fOm84Ctx2+Kmbt+GbJ89cHDttHurqk/29nFAusUtNbzJw9JT9h38rL" +
    "Y2Uk6grIague/FG9OLlGwNHToY2vSzkCH0TTR1qU8UvUtyZw" +
    "1dK2nuw3+LZYJUlp233lZt3lZSUOKveMv4xoo4NM/AZ2" +
    "lAzF65q0qmPSgFHoQ2PY5e6WmIVDY+/rrVaK4fkGlpF7z3" +
    "2SfV5qfWgbg57HQHa8XOWS2dXozseWah/l0Xp5gvSQo6fX/" +
    "yzYeadLGHCQLOvYMLot9PnInr0dR/qIgN88EqP7th3uEWXvh" +
    "42F/o23LCSGYTWGeXtqQBwoEBBHcQRrt3Ktd2GdVv1xlnLYa+" +
    "EtOSnHfv7j57uz2gZixz14May7ew1dHEj94ZiD5nqwyXMYopGtkl" +
    "lGZXFvhgnMO0FkgCPF2JALl6mVWFMMQ45mETBG4qX53hK8B" +
    "9U0gFe8wRSRPcBo1dv3J6bf1ctahqW39PVOUCBQJPhlHs3f" +
    "9q85bXCLezRDYHQ5bkiO20ax6G4T2PgCs5tzaYd0MR33JV" +
    "tkaoRKffOffPWndU/7ew1ZHxaRgvp96Qyn+1ky+8qntMaboQqn+LWVM9WbqFPdblOENr9rQpgNXK" +
    "zunPYPVduJar3K3cMWl2TLBkwJvDqN+rcb/ii1RuBSC1+h46o05CZnv2XaT5TUhbZuedgm57D3ktjbaG00Nsm" +
    "UJK8IBRxkTz9/OgoTF948J9amb2Gjt1/7ISu67G71t" +
    "S8RXxX3M51TmEEQP748w6o9WW17Qn9LusWYFdJl" +
    "YCxIc1vA1LsMOtfQKJ8em0MIO3tcvXnccoiiX3UmmO3H" +
    "I9dlV8jPBNs+tW3Iyav2LD94h9/6q9PtlVPqLYfsFQNkerg" +
    "sdPMkRf57rC+nRaK9fkEQveOwGQ4Ai01WFUP92dfNhny/f" +
    "RDR09GIjZ/qB4gzleMln/m4DHsLT194cqS1ZuANgCYhIay" +
    "CnhHbsYBI/2SgjF1A5w6FemRA+b2zw6AqWeXhwAyo1P" +
    "mwmzsTYVYixhQ/2WINr9s+tU3g8fPWbru0G+nQO4aK5kGY" +
    "yOJm5S8L7HwUi14WvGnCdgzFy9PmLWoNlAIlVg9RTAuHG+NQ" +
    "Oj6iWwhGRxWCg+a9V2hlIH3+8qp5tTv5+lN4fb867GTr3gpT3fe1XU5UsqbjbpzLQJLLPUyOHagULxjz6/T5i3" +
    "t9t3YYItu/6mdjSfPGssqr1rjYJnbPVVGTEyYUe6T4hBrsdQ8xw0Iyy3" +
    "yMdw7vmjcqXOfYVBWAUm7i1eul5QZUec7tBJmu5fTmcSBveFuQ" +
    "GnGOHbqAjBdamS24S174etYn13DoD32nRII3U0odUxL4B33nXIqlm" +
    "ahAvvyKeJmDI8/qpP9Vb8Razduvf/wiewfc76NUmCIDV/lnJvNRLL" +
    "08FHB8TMXNmzdM+WHZb2HjWvebSAsf4Y+WIqID9FxCaE" +
    "qe2lHMHg4+yS2asqf1BwFmFjUmaF47ez6jTo2/6p/7" +
    "8FjJ80GvbIdgJN7efcjhm7LkC2Q6famgr2/F/NrgP8e" +
    "FTzdvGdf/9FT4dbG+rfwLjKl2+edd6XJLt/m21OVSWYQqmi" +
    "U3kA2eR2Jljj0QbWEowaKsGpm0pylR4+fKbHGusupsBuvySf/8oN7DAh" +
    "lb93NA3xu331w9catMPMBJB5INfsNmwhOqXnnftltvg" +
    "aDzVNgoK8De+CgIgLFXjQIp+H5ug06wCrpcOtvMtv0aN" +
    "qpf8feI3sPnTB8whz44X9Ytn7Vhi3bdu07duosFIeLlYpU+U" +
    "Wpv+woxP78ltKPHj117uLUecsbtOvxbhoPQ+TdTabottzVX" +
    "16z561hz1d6e2pQ/7DVgX7m/eqhxh36TvhhxaFjJwA2rz+m" +
    "f+Eq/8fD/U//ohGN/s1/9P/2Ybo8CN1Pnf39hyVrOvYaYhZai" +
    "HNLIPw3ckvhMM2begqjL8JtvknHfmOmztu8cz+Q43SRL0olV" +
    "FUOzHlujaii1KBH4/5hlHOTkIWW8ojvsgDDDF6X9+jxgcPHwMc279zng5rhyl6ztw5RvUy8yQiEb3gaQO0HSsEbOUU" +
    "FyPykXoNW3wyZOGvBzn2H7+TmQc/DKgzGBn7lw0D" +
    "V0nytI3Ny7l77pTm" +
    "6VQ5F9jXO01HpNRQ9SfwyL//x7gNHoZ8O4XGNY" +
    "EszzvRmOfI3O4eGjED4xhDIplFTNVvqIidW8RSK" +
    "lWwSsUBWDrX6uu/wSbMXrty1/8i16zfLynR7Gh" +
    "kp3wf+VRyp/6+x6P8c3zpfyf7vcAe5fefuvkPHoAU/a" +
    "Mx0KN6kpjcVM/JWQ09lApnJHt8GEaZwlED4hus6tra" +
    "bL+hghMp2glM6xU4MMEdX08JQ+u/Ya9jwCbMWLN/wy" +
    "95D0FTMz8+HeX8JBrXtYcS6UOP1GNONcqGrtFSUv8Uj4e" +
    "irV2V37j/47fT5zTsPzlv+48hJs7sOGAOcz/eqh7DHyJW1kBav9DNYV" +
    "dOcareKKEBwe5uaewTCuOeE3qCjXodNAtUt8OMITo" +
    "AdR5UI5kCyaYojhcfAR4WSJuy+hM17Y6bMnbt0zer1Wzfv" +
    "2Lvv0PETpy+ADsD123dgM/HTwoLi4uK/iCfhG8+Ki2D4NTcv/9bde5f/vAbjIAcPH4elRdCBAJiNm7EQ" +
    "nHOn3kNz2vfxB1uYA+miEaKOpMh3p9xNTNTJvfDsrY" +
    "WFHJb128AHpHdOIHzjHQ7nnIFKi5NtN8SVowv/OoK1j" +
    "HIFlyDsIIUKV2Mb9ufqmgLA8v/4OudTxRtyNGMcpDnF" +
    "pfPk1pRm8iPT1SIYOX5+OyFOU1mpKDZBx4ZA+C9" +
    "opXhjSGevoYypcOV9Z1+wXEKZACdKFXGpRZsL8gZjmS7lckR" +
    "jidevw1658hMWtQ1HJfwxrX8hVVgOQdw" +
    "bUomBvBlIESmBkIyMQEhGRkYgJCMjEJKRkREIy" +
    "cgIhGRkZARCMjICIRkZGYGQjIxASEZGRiAkIyMQkp" +
    "GREQjJyAiEZGRkBEIyMgIhGRkZgZCMjEBIRkZGICQjIxCS" +
    "kZERCMnICIRkZGQEQjIyAiEZGYGQjIyMQEhGRiAkIyMjEJ" +
    "KREQjJyMgIhGRkBEIyMjICIRkZgZCMjIxASEZGICQjIyMQkpER" +
    "CMnIyAiEZGQEQjIyMgIhGRmBkIyMjEBIRkYgJCMjIxCSkSWn/X+K" +
    "HQMSBxfTMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wMi0w" +
    "OVQxODozMzoyMyswMTowMMjH/DwAAAAldEVYdGRhdGU6bW9" +
    "kaWZ5ADIwMTctMDItMDlUMTg6MzM6MjMrMDE6MDC" +
    "5mkSAAAAAEXRFWHRleGlmOkNvbG9yU3BhY2UAM" +
    "Q+bAkkAAAAhdEVYdGV4aWY6RGF0ZVRpbWUAMjAx" +
    "NjoxMjoyOCAxNzoxOTo0M5/o8eQAAAAYdEVYdGV4aWY6" +
    "RXhpZkltYWdlTGVuZ3RoADMwMBnpoG8AAAAXdEVYdGV4a" +
    "WY6RXhpZkltYWdlV2lkdGgAMzAwhHYlfQAAABN0RVh0ZXhpZjp" +
    "FeGlmT2Zmc2V0ADE2NMx7KxQAAAArdEVYdGV4aWY6U29mdH" +
    "dhcmUAQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cynnqcc7" +
    "AAAAHHRFWHRleGlmOnRodW1ibmFpbDpDb21wcmVzc2lvbgA2+WVwVwAAACh0RVh0ZXhpZjp0aHVtYm5haWw6SlBFR0ludGVyY" +
    "2hhbmdlRm9ybWF0ADMwMkUkal0AAAAvdEVYdGV4aWY6dGh1bW" +
    "JuYWlsOkpQRUdJbnRlcmNoYW5nZUZvcm1hdExlbmd0aAAyOTYwA" +
    "1l2fAAAAB90RVh0ZXhpZjp0aHVtYm5haWw6UmVzb2x1dGlvblVuaX" +
    "QAMiVAXtMAAAAfdEVYdGV4aWY6dGh1bWJuYWlsOlhSZXNvbHV0a" +
    "W9uADcyLzHahxgsAAAAH3RFWHRleGlmOnRodW1ibmFpbDpZUmV" +
    "zb2x1dGlvbgA3Mi8xdO+JvQAAADh0RVh0aWNjOmNvcHlyaWdodAB" +
    "Db3B5cmlnaHQgKGMpIDE5OTggSGV3bGV0dC1QYWNrYXJkIENvbXBh" +
    "bnn5V3k3AAAAIXRFWHRpY2M6ZGVzY3JpcHRpb24Ac1JHQiBJRUM2MT" +
    "k2Ni0yLjFXrdpHAAAAJnRFWHRpY2M6bWFudWZhY3R1cmVyAElFQy" +
    "BodHRwOi8vd3d3LmllYy5jaBx/AEwAAAA3dEVYdGljYzptb2RlbABJRU" +
    "MgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0JE" +
    "U0ipAAAAAElFTkSuQmCC";
const eventSchema = new mongooseSchema({
    events: { any: Object, default: {} }
}, { minimize: false });

const userSchema = mongooseSchema({
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    salt: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    avatar: { type: String, default: defaultAvatar },
    request: [{
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        }
    }],
    friends: { type: [friendsSchema], default: [] },
    newRequest: { type: Number, default: 0 },
    eventsAsCreator: [{}],
    eventsAsParticipant: [{}],
    events: { type: Object, default: { 'pesho': "gosho" }, minimize: false }
});



userSchema.methods = {
    authenticate(password) {
        const requestedHashedPassword = encryption.generateHashedPassword(this.salt, password);
        return requestedHashedPassword === this.hashedPassword;
    }
};

const User = mongoose.model("user", userSchema);

module.exports = User;

module.exports.seedAdminUser = () => {
    User.find({}).then(users => {
        if (users.length === 0) {
            let salt = encryption.generateSalt();
            let hashedPass = encryption.generateHashedPassword(salt, '1234q');

            User.create({
                username: 'admin',
                email: 'Admin@place.com',
                salt: salt,
                hashedPassword: hashedPass,
                request: [],
                friends: [],
                role: 'Admin',



            });
        }
    });
};