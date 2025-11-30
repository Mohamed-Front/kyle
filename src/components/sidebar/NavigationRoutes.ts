export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigation.home',
    meta: {
      icon: 'home'
    }
  },
  routes: [
    // {
    //   name: 'dashboard',
    //   displayName: 'navigation.dashboard',
    //   show: ['list users'],
    //   meta: {
    //     icon: 'dashboard',
    //   },
    // },
    {
      name: 'registration',
      displayName: 'طلبات التسجيل',
      meta: {
        icon: 'dashboard',
      },
    },
    {
      name: 'home-banner',
      displayName: 'البانرات الترويجية',
      meta: {
        icon: 'dashboard',
      },
    },
  {
      name: 'products',
      displayName: ' المنتجات',
      meta: {
        icon: 'dashboard',
      },
    },
{
      name: 'games',
      displayName: ' العابي',
      meta: {
        icon: 'dashboard',
      },
    },

{
      name: 'team',
      displayName: ' الفريق',
      meta: {
        icon: 'dashboard',
      },
    },

{
      name: 'post',
      displayName: ' مغامرتنا',
      meta: {
        icon: 'dashboard',
      },
    },

  ] as INavigationRoute[],
}
