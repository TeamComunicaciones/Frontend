import { reactive } from 'vue';
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

export const authState = reactive({
  isLoggedIn: cookies.isKey('jwt'),
  
  login() {
    this.isLoggedIn = true;
  },
  
  logout() {
    cookies.remove('jwt');
    this.isLoggedIn = false;
  }
});