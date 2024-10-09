import './gui.scss';

export function reactive(target: any, onChange: Function) {
  const updateVal = (target: any, key: string | symbol, value: any) => {
    const input = document.getElementById('val_' + key.toString()) as
      | HTMLInputElement
      | HTMLSelectElement;
    if (input && input.value !== value) {
      input.value = value;
    }
  };
  return new Proxy<any>(target, {
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver);
      // 保存effect
      //track(target, key);

      return result;
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      let result = Reflect.set(target, key, value, receiver);

      if (oldValue !== value) {
        // 运行effect
        //trigger(target, key);

        updateVal(target, key, value);
        onChange(target, key);
      }
      return result;
    }
  });
}
export type GuiType = { label: string; name: string } & (
  | { type: 'number'; min: number; max: number; step: number }
  | {
      type: 'select';
      options: { [n: string | number]: number | string | boolean } | string[] | number[];
    }
  | { type: 'color' | 'switch' | 'text' | 'button' }
);

export function createGui(data: any, config: GuiType[], onChange: Function) {
  const dom = document.createElement('div');
  dom.className = 'gui-container';
  document.body.appendChild(dom);
  const dataObj = reactive(data, onChange);
  config.forEach((item) => {
    const div = document.createElement('div');
    const n = item.name;
    const id = `val_${n}`;
    const v = dataObj[n];

    if (item.type === 'color') {
      div.innerHTML = `<label>${item.label}</label><input type="color" value="${v}"  name="${n}" id="${id}">`;
    } else if (item.type === 'number') {
      div.innerHTML = `<label>${item.label}</label><input type="range" value="${v}" name="${n}" min="${item.min}"  max="${item.max}" step="${item.step}"  id="${id}">`;
    } else if (item.type === 'select') {
      const options = Array.isArray(item.options)
        ? item.options.map((it) => `<option value="${it}">${it}</option>`).join('')
        : Object.keys(item.options)
            .map((it) => `<option value="${item.options[it]}">${it}</option>`)
            .join('');
      div.innerHTML = `<label>${item.label}</label><select  value="${v}" name="${n}" id="${id}">${options}</select>`;
    } else if (item.type === 'text') {
      div.innerHTML = item.label;
    } else if (item.type === 'switch') {
      div.innerHTML = `<label>${item.label}</label><input type="checkbox" value="${v}" name="${n}" id="${id}">`;
    } else if (item.type === 'button') {
      div.innerHTML = `<button>${item.label}</button>`;
    }
    dom.appendChild(div);
    if (item.type === 'text') return;
    if (item.type === 'button' && div.firstElementChild) {
      (div.firstElementChild as HTMLButtonElement).onclick = () => {
        div.firstElementChild?.classList.toggle('active');
        dataObj[item.name] = !dataObj[item.name];
        if (div.firstElementChild) {
          if (!dataObj[item.name] && div.firstElementChild.classList.contains('active')) {
            div.firstElementChild.classList.remove('active');
          } else if (dataObj[item.name] && !div.firstElementChild.classList.contains('active')) {
            div.firstElementChild.classList.add('active');
          }
        }
      };

      return;
    }
    const input = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
    if (input) {
      input.onchange = () => {
        if (item.type === 'switch' && input.type === 'checkbox') {
          dataObj[item.name] = input.checked;
        } else if (item.type === 'number') {
          dataObj[item.name] = Number(input.value);
        } else {
          dataObj[item.name] = input.value;
        }
      };
    }
  });
  return dataObj;
}
