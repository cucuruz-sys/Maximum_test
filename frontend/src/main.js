
//
//  Набор js функций которые пригодятся в разработке
//

// функция для скрытия эелемента
import config from "../config.json";

export function closeModal(modalId) {
  try {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
  } catch {
  }
}

// функция для показа эелемента (если элемент скрыт)
export function openModal(modalId) {
  try {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
  } catch {
  }
}

// проверка на показ элемента
export function checkModal(modalId) {
  try {
    var modal = document.getElementById(modalId);
    return (modal.style.display == "block")

  } catch {
    return false;
  }
}

// открыть новую вкладку
export function openInNewTab(url) {
  window.open(url, '_blank').focus();
}

// добавить элемент в список (ul)
export function append_to_ul(id, content) {
  var ul = document.getElementById(id);

  var li = document.createElement("li");

  li.innerHTML = content;

  ul.appendChild(li);
}

// очистить список (ul)
export function clear_ul(id) {
  document.getElementById(id).innerHTML = '';
}

// скрол до самого низа
export function scroll_to_bottom(id) {
  var objDiv = document.getElementById(id);
  objDiv.scrollTop = objDiv.scrollHeight;
}

// скрол до самого верха
export function scroll_to_top(id) {
  var objDiv = document.getElementById(id);
  objDiv.scrollTop = 0;
}

//
export function debounce(func, wait_ms) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait_ms);
  };
}

// получить данные из локального хранилища
export function get_localStorage(key, default_return=null) {
  if (localStorage.getItem(key) != null)
    return localStorage.getItem(key);

  else
    return default_return;
}

// сохранить массив флагов в локальное хранилище
export function save_localStorage_groupFlags(key, flags_list) {
  var save_str = "";
  for (el of flags_list) {
    save_str += (el)? "1": "0";
  }
  localStorage.setItem(key, save_str);
}

// достать массив флагов из локального хранилища
export function get_localStorage_groupFlags(key, defualt_flags_list) {
  if (localStorage.getItem(key) != null) {
    var flags_list = [];
    for (el of localStorage.getItem(key)) {
      flags_list.push((el == "1"));
    }
    return flags_list;
  } else {
    return defualt_flags_list;
  }
}
// фокус ввода на элемент
export function on_focus(id) {
  document.getElementById(id).focus()
}

// получить адрес текущей страницы без домена
export function get_current_page() {
  var addr = window.location.href.split("//")[1];
  return addr.slice(addr.indexOf("/"))
}

//
const getMethods = (obj) => {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

//
export function check_device() {
  return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

//
export function generate_random_hex_color() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// генерация рандомного числа
export function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// меняет значение чекбокса на обратное
export function reverse_checkBox(id) {
  document.getElementById(id).checked = !document.getElementById(id).checked;
  var event = new Event('change');
  document.getElementById(id).dispatchEvent(event);
}

// установка размера прогресса в зависимости от размера
export function set_progressbar(name, state = 0, count=1) {
  if (count > 1) {
    for (let i = 0; i < count; i++) {
      document.getElementById(name + "_" + i).style.width = (document.getElementById(name + "_div").offsetWidth/100) * state[i];
    }
  } else {
    document.getElementById(name).style.width = (document.getElementById(name + "_div").offsetWidth/100) * state;
  }
}

////////////////////////////////////////////////////////////////////////////////
export function check_login(alert_flag = false) {
  return new Promise((resolve, reject) => {
    fetch(`${config.protocol}://${config.ip}/auth/check`, {
      method: 'GET',
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      credentials: 'include',
    })
        .then(response => {
          console.log(response.status);
          if (response.status === 200) {
            console.log("authorized");
            if (get_current_page() !== "/main") {
              window.location.href = '/main';
            }
            resolve(true);
          } else {
            console.log("unauthorized");
            if (alert_flag) {
              alert("Неверный логин или пароль");
            } else if (get_current_page() !== "/authpage") {
              window.location.href = '/authpage';
            }
            resolve(false);
          }
        })
        .catch(error => {
          console.error("Произошла ошибка:", error);
          reject(error);
        });
  });
}


export async function get_userData() {
    return new Promise((resolve, reject) => {
      fetch(`${config.protocol}://${config.ip}/messages_and_dialogs/get_user_data`, {
        method: 'GET',
        credentials: "include",
      }).then(response => response.json())
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            console.error("Произошла ошибка:", error);
          });
    });
}
