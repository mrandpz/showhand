import commodity from './commodity'
import decoration from './decoration'
import operate from './operate'
import order from './order'
import picking from './picking'

export default [commodity, order, picking, operate, decoration].filter(item => item)
