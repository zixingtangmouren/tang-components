interface UserInfo {
  sex?: 'boy' | 'girl';
}

const user: UserInfo = {};

export function sum(a: number, b: number) {
  return a + b;
}

export function ha(a: any) {
  switch (a) {
    case 'a':
      console.log('a');
    case 'b':
      console.log('b');
  }
}

export function isOk() {
  const k = true;

  if (k) {
    return true;
  } else {
    return false;
  }
}

// class A {
//   num: number;
// }

const str = 'Hello!';
for (const s of str) {
  console.log(s);
}
