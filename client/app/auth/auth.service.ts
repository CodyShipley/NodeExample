namespace app.services {
    export class AuthService {
      public status = {
        _id: null,
        username: null,
        role:null
      }

      public register(u: IUser){
        let q = this.$q.defer();
        this.$http.post('/api/auth/local/register', u).then((res)=>{
          this.setToken(res.data['token']);
          this.setUser();
          q.resolve();
        }, () => {
          q.reject();
        });
        return q.promise;
      }

      public login(u: IUser){
        let q = this.$q.defer();
        this.$http.post('/api/auth/local/login', u).then((res)=>{
          this.setToken(res.data['token']);
          this.setUser();
          q.resolve();

        }, () => {
          q.reject();
        });
        return q.promise;
      }

      public logout(){
        this.$window.localStorage.removeItem('token');
        this.status._id = null;
        this.status.username = null;
        this.status.role = null;
      }


      public setUser(){
        let u = JSON.parse(this.urlBase64Decode(this.getToken().split('.')[1]));
        this.status._id = u._id;
        this.status.username = u.username;
        this.status.role = u.role;

      }

      public getToken(){
        return this.$window.localStorage.getItem('token');
      }

      public setToken(token: string){
        this.$window.localStorage.setItem('token', token);
      }


      private urlBase64Decode(str){
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch(output.length % 4){
          case 0: {break;}
          case 2: {output += '=='; break;}
          case 3: {output += '='; break;}
          default:{
            throw'Illegal base64url string!'
          }
        }
        return decodeURIComponent(encodeURIComponent(this.$window.atob(output)))
      }


        constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $window: ng.IWindowService) {

          if(this.getToken()) this.setUser();
        }
    }
    angular.module('app').service('AuthService', AuthService);
}
