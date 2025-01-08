// CardItem.test.js
import React from 'react'

beforeAll(() => {
  Object.defineProperty(global, 'import.meta', {
    value: {
      env: {
        VITE_REACT_APP_SERVER: 'http://localhost:3001',
      },
    },
  })
})

afterAll(() => {
  delete global.importMetaEnv
})

import { render, screen, fireEvent } from '@testing-library/react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/verifyJWT'
import convertCurrency from '../../utils/convertCurrency'
import { globalContext } from '../../App'
import CardItem from '../CardItem'

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))

// Mock axiosInstance
jest.mock('../../utils/verifyJWT')

// Mock convertCurrency
jest.mock('../../utils/convertCurrency', () => jest.fn())

// Mock globalContext
const mockSetCartItems = jest.fn()
const mockContextValue = {
  isLoggedIn: true,
  setCartItems: mockSetCartItems,
}

describe('CardItem Component', () => {
  const mockNavigate = jest.fn()
  const mockData = {
    _id: '1',
    name: 'Test Product',
    price: 100,
    stock: 10,
    productThumbnail: 'test-image.jpg',
    promo: 20,
  }

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate)
    convertCurrency.mockResolvedValue({ price: 80, currency: 'USD' })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderComponent = (props = {}) =>
    render(
      <globalContext.Provider value={{ ...mockContextValue, ...props }}>
        <CardItem data={mockData} display={true} width={200} />
      </globalContext.Provider>
    )

  test('renders product name and price', async () => {
    renderComponent()
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(await screen.findByText('80.00 USD')).toBeInTheDocument()
  })

  test('handles "Add To Cart" click when user is logged in', async () => {
    axiosInstance.post.mockResolvedValue({ status: 200 })
    renderComponent()
    fireEvent.mouseEnter(screen.getByRole('img'))
    fireEvent.click(screen.getByText('Add To Cart'))
    expect(mockSetCartItems).toHaveBeenCalledWith(expect.any(Function))
    expect(axiosInstance.post).toHaveBeenCalledWith(
      `${process.env.VITE_REACT_APP_SERVER}/api/updateCart?isNewItem=true`,
      { productId: '1', quantity: 1 }
    )
  })

  test('redirects to login when user is not logged in', () => {
    renderComponent({ isLoggedIn: false })
    fireEvent.mouseEnter(screen.getByRole('img'))
    fireEvent.click(screen.getByText('Add To Cart'))
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})
