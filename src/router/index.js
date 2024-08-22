import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ticketComponent from '../components/bookTicket.vue'
import hotelComponent from '../components/bookHotel.vue'
import foodComponent from '../components/bookFood.vue'
import ordersComponent from '../components/myOrders.vue'
import ticketDetail from '../components/ticketDetail.vue'
import personalCenter from '../components/personalCenter.vue'
import passengersInfo from '../components/passengersInfo.vue'
import myCollect from '../components/myCollect.vue'
import ticketOrders from '../components/orders/ticket.vue'
import hotelOrders from '../components/orders/hotel.vue'
import foodOrders from '../components/orders/food.vue'
import myTicket from '../components/orders/myTicket.vue'
import About from '../components/hotelDetail.vue'


const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: 'ticket',
        component: ticketComponent
      },
      {
        path: 'hotel',
        component: hotelComponent
      },
      {
        path: 'dining',
        component: foodComponent
      },
      {
        path: 'orders',
        component: ordersComponent,
        children: [
          {
            path: 'personalCenter',
            component: personalCenter
          },
          {
            path: 'passengersInfo',
            component: passengersInfo
          },
          {
            path: 'ticketOrders',
            component: ticketOrders
          },
          {
            path: 'hotelOrders',
            component: hotelOrders
          },
          {
            path: 'foodOrders',
            component: foodOrders
          },
          {
            path: 'myTicket',
            component: myTicket
          },
          {
            path: 'myCollect',
            component: myCollect
          }
        ]
      },
      {
        path: 'ticketDetail',
        name: 'detail',
        component: ticketDetail
      },
      {
        path: 'about',
        name: 'about',
        component: About
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
