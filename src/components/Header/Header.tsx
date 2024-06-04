'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { MagnifyingGlass, ShoppingCart, User } from 'phosphor-react'

import { navs, PROFILE_PAGE } from '@/components/Header/constants'
import { create } from '@/app/actions/actions'
import { setIsCartOpened } from '@/features/cart/cartSlice'

const Header = () => {
  const dispatch = useDispatch()
  const t = useTranslations('Header')

  useEffect(() => {
    create().then()
  }, [])

  const handleOpenCart = () => {
    dispatch(setIsCartOpened())
  }

  return (
    <header className="bg-white-yellow shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="hidden space-x-8 md:inline-block">
            {navs.map(({ title, href }) => (
              <Link
                href={href}
                className="px-3 py-2 text-xl font-black uppercase text-dark-green duration-200 hover:text-light-green-200"
                key={title}
              >
                {t(title)}
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            <svg width="70" height="70" viewBox="0 0 235 204">
              <path
                d="M 92.449 9.083 C 92.137 9.587, 92.160 10.450, 92.500 11 C 93.378 12.421, 149.662 12.356, 150.541 10.933 C 150.904 10.347, 150.990 9.656, 150.732 9.399 C 149.810 8.476, 93.014 8.169, 92.449 9.083 M 174.022 14.477 C 171.746 16.899, 171.319 16.960, 154.845 17.227 C 144.676 17.392, 137.898 17.896, 137.748 18.500 C 137.588 19.146, 148.412 19.594, 168.338 19.765 C 192.844 19.975, 199.091 19.769, 198.759 18.765 C 198.499 17.978, 196.060 17.389, 192.303 17.206 C 187.409 16.967, 185.828 16.446, 183.958 14.456 C 180.975 11.280, 177.017 11.288, 174.022 14.477 M 69.333 17.576 C 68.180 20.580, 74.133 27.275, 81.040 30.742 C 84.593 32.525, 87.950 34.156, 88.500 34.367 C 89.050 34.578, 87.803 36.522, 85.730 38.688 C 83.656 40.854, 82.268 42.935, 82.646 43.313 C 84.065 44.731, 89.680 43.897, 94.821 41.503 L 100.142 39.026 106.131 41.044 C 115.286 44.128, 141.214 50.985, 143.750 50.993 C 147.172 51.004, 146.457 49.320, 141.750 46.285 L 137.500 43.545 142.500 42.860 C 145.250 42.483, 153.912 42.136, 161.750 42.088 C 175.304 42.004, 176 41.902, 176 40 C 176 38.057, 175.333 38, 152.500 38 C 128.930 38, 123.953 37.195, 134.250 35.049 C 137.137 34.447, 142.114 33.403, 145.310 32.727 C 155.782 30.515, 151.440 29.500, 131.500 29.500 L 112.500 29.500 102 24.656 C 87.325 17.885, 81.513 16, 75.312 16 C 71.342 16, 69.779 16.412, 69.333 17.576 M 49 27 C 49 27.550, 49.450 28, 50 28 C 50.550 28, 51 27.550, 51 27 C 51 26.450, 50.550 26, 50 26 C 49.450 26, 49 26.450, 49 27 M 53.500 27 C 53.160 27.550, 53.359 28, 53.941 28 C 54.523 28, 55 27.550, 55 27 C 55 26.450, 54.802 26, 54.559 26 C 54.316 26, 53.840 26.450, 53.500 27 M 170 28.500 C 170 29.667, 171.333 30, 176 30 C 180.667 30, 182 29.667, 182 28.500 C 182 27.333, 180.667 27, 176 27 C 171.333 27, 170 27.333, 170 28.500 M 39 39.875 C 39 41.291, 38.205 41.975, 36.250 42.241 L 33.500 42.614 36.250 43.782 C 37.763 44.425, 39 45.637, 39 46.475 C 39 47.314, 39.450 48, 40 48 C 40.550 48, 41 47.152, 41 46.117 C 41 45.050, 41.976 43.911, 43.250 43.490 L 45.500 42.746 43.250 42.303 C 42.013 42.060, 41 41.244, 41 40.489 C 41 39.735, 40.550 38.840, 40 38.500 C 39.450 38.160, 39 38.779, 39 39.875 M 185 39 C 185 39.584, 188.353 40, 193.059 40 C 198.177 40, 200.892 39.635, 200.500 39 C 200.160 38.450, 196.534 38, 192.441 38 C 188.147 38, 185 38.423, 185 39 M 181 47 C 181 47.550, 181.450 48, 182 48 C 182.550 48, 183 47.550, 183 47 C 183 46.450, 182.550 46, 182 46 C 181.450 46, 181 46.450, 181 47 M 194 49 C 194 49.550, 194.477 50, 195.059 50 C 195.641 50, 195.840 49.550, 195.500 49 C 195.160 48.450, 194.684 48, 194.441 48 C 194.198 48, 194 48.450, 194 49 M 57.867 50.988 C 52.949 53.614, 46.612 61.013, 45.176 65.807 C 44.529 67.966, 44 71.731, 44 74.175 C 44 76.618, 43.366 79.485, 42.590 80.546 C 41.241 82.391, 41.097 82.398, 39.232 80.710 C 37.850 79.460, 37.109 77.074, 36.682 72.502 C 35.829 63.359, 31.597 55.768, 25.124 51.768 C 21.821 49.726, 21.679 49.719, 20.360 51.523 C 17.366 55.617, 19.613 66.019, 24.800 72.079 C 26.775 74.387, 30.891 77.854, 33.946 79.784 C 37.001 81.714, 39.662 83.426, 39.859 83.589 C 40.057 83.752, 39.220 85.286, 38.001 86.999 C 35.871 89.989, 35.706 90.044, 33.859 88.373 C 32.801 87.415, 31.032 85.170, 29.928 83.384 C 25.710 76.559, 11.179 70.228, 6.042 72.977 C 4.158 73.986, 4.105 74.303, 5.401 76.809 C 9.157 84.073, 17.293 89.013, 26.748 89.772 C 30.216 90.050, 33.261 90.613, 33.513 91.022 C 34.233 92.187, 30.032 97, 28.295 97 C 27.438 97, 25.110 95.995, 23.122 94.767 C 18.627 91.988, 10.055 91.777, 5.250 94.327 C 1.252 96.448, 1.141 98.061, 4.841 100.247 C 10.253 103.444, 15.377 103.540, 21.471 100.558 C 24.497 99.077, 27.381 98.117, 27.878 98.425 C 28.376 98.732, 27.711 101.575, 26.401 104.742 C 25.090 107.909, 23.732 112.188, 23.381 114.250 C 22.433 119.835, 21 118.782, 21 112.500 C 21 109.475, 20.550 107, 20 107 C 18.567 107, 18.798 116.383, 20.418 124.024 C 28.389 161.621, 60.013 190.437, 100 196.539 C 117.351 199.186, 133.038 197.729, 149.625 191.928 C 180.317 181.196, 203.316 156.158, 209.557 126.685 C 211.407 117.946, 211.540 118.628, 207.616 116.757 C 205.756 115.870, 202.588 113.699, 200.578 111.934 L 196.922 108.724 194.684 110.827 C 192.236 113.126, 189.804 112.929, 184.500 110.002 C 182.850 109.091, 178.437 106.641, 174.694 104.556 L 167.889 100.766 156.194 108.506 C 143.259 117.068, 139.801 119.869, 140.590 121.145 C 141.755 123.031, 144.672 121.649, 156.141 113.780 L 168.121 105.560 176.100 109.869 C 181.727 112.909, 184.437 113.882, 185.293 113.172 C 186.123 112.483, 187.082 112.587, 188.332 113.501 C 189.793 114.569, 189.942 115.239, 189.079 116.852 C 187.561 119.689, 187.645 119.836, 190.981 120.187 L 193.962 120.500 190.808 125.334 C 188.415 129.002, 187.963 130.359, 188.937 130.961 C 189.904 131.559, 189.302 133.198, 186.489 137.627 C 184.437 140.857, 182.547 143.725, 182.289 144 C 181.638 144.695, 177.011 138.784, 177.005 137.250 C 177.002 136.563, 177.675 136, 178.500 136 C 180.485 136, 180.393 135.316, 178 132.273 C 175.374 128.935, 175.477 128, 178.469 128 C 180.891 128, 180.859 127.893, 176.765 122.420 L 172.592 116.840 168.334 121.670 C 165.993 124.326, 164.060 126.838, 164.038 127.250 C 164.017 127.662, 165.162 128, 166.582 128 L 169.163 128 166.966 131.555 C 164.954 134.810, 164.907 135.212, 166.410 136.311 C 167.891 137.394, 167.712 138.048, 164.576 143.005 C 161.940 147.171, 161.451 148.578, 162.550 148.823 C 164.592 149.279, 164.360 150.313, 161.644 152.865 L 159.288 155.078 153.531 147.952 L 147.773 140.826 144.636 145.284 C 142.911 147.736, 139.925 151.938, 138 154.621 C 136.075 157.305, 134.350 159.838, 134.167 160.250 C 133.983 160.662, 135.951 161, 138.539 161 C 142.801 161, 143.116 161.156, 141.874 162.652 C 141.119 163.561, 138.112 166.070, 135.190 168.229 C 126.526 174.630, 126.896 176.234, 137.637 178.837 C 141.412 179.752, 144.323 180.950, 144.106 181.500 C 143.889 182.050, 141.668 183.276, 139.170 184.224 C 136.673 185.172, 132.668 187.872, 130.271 190.224 L 125.912 194.500 114.080 194.364 C 101.591 194.220, 96.811 192.974, 96.180 189.694 C 95.669 187.041, 97.503 185.399, 102.562 183.983 C 110.076 181.879, 111.774 177.163, 105.771 175.070 C 102.098 173.790, 86.075 173.666, 84.122 174.904 C 81.098 176.819, 84.318 178, 92.559 178 C 99.395 178, 101 178.285, 101 179.500 C 101 181.733, 83.813 181.670, 81.571 179.429 C 79.353 177.210, 79.621 174.379, 82.223 172.557 C 83.984 171.323, 87.427 171, 98.806 171 C 109.848 171, 113.071 170.711, 112.754 169.750 C 112.487 168.943, 109.263 168.288, 103.666 167.901 C 97.325 167.464, 94.455 166.817, 92.996 165.496 C 90.774 163.485, 90.395 161.368, 92.153 160.782 C 93.179 160.440, 89.560 154.123, 84.542 147.500 C 83.120 145.623, 82.962 145.607, 81.964 147.250 C 81.240 148.442, 79.641 149, 76.950 149 C 74.106 149, 73 149.420, 73 150.500 C 73 151.433, 73.944 152, 75.500 152 C 78.490 152, 78.677 153.077, 76.094 155.415 C 74.274 157.062, 74.037 157.002, 70.844 154.085 C 68.053 151.535, 67.748 150.868, 69 150.050 C 70.316 149.190, 70.281 148.729, 68.708 146.285 C 64.786 140.187, 63.429 136.701, 64.800 136.239 C 65.833 135.890, 65.792 135.331, 64.595 133.505 C 63.194 131.367, 63.242 131.169, 65.296 130.618 C 69.197 129.572, 71.847 129.952, 76.099 132.169 C 79.722 134.057, 80.049 134.491, 78.630 135.529 C 76.508 137.080, 76.541 139, 78.688 139 C 81.020 139, 97 128.811, 97 127.324 C 97 124.640, 94.595 124.986, 89.436 128.411 L 84 132.020 77.750 129.187 C 72.970 127.021, 70.813 126.538, 68.580 127.136 C 65.315 128.010, 64.657 127.428, 60.792 120.250 C 59.533 117.912, 58.278 116.014, 58.002 116.032 C 56.958 116.097, 52 125.209, 52 127.062 C 52 128.128, 51.663 129.006, 51.250 129.014 C 50.837 129.021, 49.522 129.290, 48.326 129.610 C 46.621 130.068, 45.811 129.536, 44.576 127.146 C 42.615 123.355, 42.616 123, 44.590 123 C 45.847 123, 45.461 121.691, 42.750 116.750 C 40.864 113.313, 38.951 110.500, 38.500 110.500 C 38.049 110.500, 36.136 113.313, 34.250 116.750 C 31.539 121.691, 31.153 123, 32.410 123 C 34.366 123, 34.378 123.369, 32.537 126.928 C 31.073 129.759, 28.249 131.584, 27.107 130.438 C 26.773 130.103, 26.514 125.705, 26.531 120.664 C 26.556 113.254, 27.034 110.352, 29.031 105.500 C 31.148 100.356, 31.907 99.453, 34.354 99.174 C 36.149 98.968, 38.004 99.571, 39.354 100.799 C 44.068 105.086, 48.907 106.013, 56 103.991 C 62.454 102.151, 62.909 101.293, 59.150 98.064 C 55.299 94.757, 48.236 92.660, 44.241 93.637 C 42.733 94.005, 39.952 95.127, 38.059 96.130 C 36.167 97.132, 34.408 97.741, 34.150 97.483 C 33.192 96.525, 42.826 85.488, 44.890 85.178 C 46.068 85.001, 48.712 85.901, 50.766 87.178 C 53.807 89.069, 55.893 89.500, 62 89.500 C 68.555 89.500, 70.193 89.107, 75 86.380 C 82.175 82.311, 82.301 80.134, 75.500 77.740 C 69.289 75.554, 61.680 75.925, 56.404 78.671 C 54.257 79.788, 51.043 81.474, 49.263 82.418 C 47.482 83.362, 45.587 83.863, 45.050 83.531 C 43.351 82.481, 46.133 78.076, 49.922 75.818 C 58.712 70.580, 64.700 61.977, 65.222 53.839 C 65.459 50.134, 65.208 49.467, 63.500 49.274 C 62.400 49.150, 59.865 49.921, 57.867 50.988 M 87.500 53.864 C 85.850 54.885, 83.259 57.133, 81.742 58.860 C 79.828 61.040, 78.087 62, 76.051 62 C 74.438 62, 72.823 62.478, 72.462 63.062 C 72.101 63.646, 70.688 64.548, 69.322 65.068 C 67.955 65.587, 67.024 66.572, 67.252 67.256 C 67.565 68.197, 74.152 68.565, 94.333 68.766 C 117.164 68.994, 121 68.823, 121 67.573 C 121 65.891, 117.279 63.018, 115.027 62.962 C 114.187 62.941, 112.324 61.222, 110.887 59.141 C 109.450 57.060, 106.682 54.602, 104.736 53.679 C 99.942 51.404, 91.325 51.497, 87.500 53.864 M 99.242 55.327 C 101.301 55.972, 103.893 57.288, 105.004 58.250 C 107.558 60.464, 108.677 60.521, 106.872 58.345 C 105.250 56.389, 99.810 53.968, 97.282 54.077 C 96.302 54.119, 97.184 54.682, 99.242 55.327 M 157 55.500 C 157 56.787, 160.056 57, 178.500 57 C 197.963 57, 203.059 56.388, 198.418 54.607 C 197.548 54.273, 187.873 54, 176.918 54 C 159.880 54, 157 54.217, 157 55.500 M 203.270 60.212 C 202.044 60.803, 200.471 62.573, 199.776 64.144 C 198.367 67.327, 195.671 67.822, 192.559 65.468 C 189.761 63.352, 184.377 63.623, 182 66 C 180.900 67.100, 180 68.450, 180 69 C 180 69.635, 172.333 70, 159 70 C 141 70, 138 70.214, 138 71.500 C 138 72.812, 143.778 73, 184 73 C 224.222 73, 230 72.812, 230 71.500 C 230 70.440, 228.900 69.989, 226.250 69.962 C 223.017 69.929, 222.115 69.368, 219.712 65.895 C 215.610 59.968, 208.714 57.584, 203.270 60.212 M 88 74.500 C 88 75.875, 88.450 77, 89 77 C 89.550 77, 90 75.875, 90 74.500 C 90 73.125, 89.550 72, 89 72 C 88.450 72, 88 73.125, 88 74.500 M 93 75 C 93 76.650, 93.450 78, 94 78 C 94.550 78, 95 76.650, 95 75 C 95 73.350, 94.550 72, 94 72 C 93.450 72, 93 73.350, 93 75 M 98.548 73.250 C 98.129 74.213, 98.129 75.787, 98.548 76.750 C 99.273 78.417, 99.329 78.417, 99.728 76.750 C 99.958 75.787, 99.958 74.213, 99.728 73.250 C 99.329 71.583, 99.273 71.583, 98.548 73.250 M 93 85.476 C 93 86.349, 92.325 87.322, 91.500 87.638 C 89.516 88.400, 89.608 89.686, 91.852 92.539 L 93.703 94.893 95.728 92.154 L 97.753 89.415 95.377 86.652 C 93.700 84.702, 93 84.356, 93 85.476 M 124.001 85.752 C 119.907 87.797, 117.611 91.951, 118.453 95.786 C 118.781 97.279, 121.288 101.125, 124.025 104.331 C 126.761 107.538, 129 111.025, 129 112.081 C 129 115.080, 133.615 114.670, 134.385 111.603 C 134.716 110.284, 136.624 107.247, 138.626 104.853 C 140.628 102.459, 142.965 99.037, 143.818 97.250 C 145.236 94.282, 145.223 93.692, 143.675 90.445 C 140.779 84.371, 131.293 82.108, 124.001 85.752 M 190.441 85.468 C 189.071 86.505, 185.804 86.946, 179.332 86.968 C 174.289 86.986, 169.452 87.273, 168.582 87.607 C 163.922 89.395, 169.082 90, 189 90 C 203 90, 211 89.636, 211 89 C 211 88.450, 209.833 88, 208.408 88 C 206.982 88, 204.671 87.100, 203.273 86 C 200.226 83.603, 193.287 83.316, 190.441 85.468 M 192.908 99 C 190.326 101.750, 187.678 104, 187.023 104 C 186.369 104, 186.021 104.563, 186.250 105.250 C 186.776 106.827, 215.982 107.072, 216.031 105.500 C 216.048 104.950, 214.956 104.361, 213.605 104.191 C 212.220 104.016, 210 102.378, 208.522 100.440 C 205.954 97.073, 201.339 94, 198.851 94 C 198.164 94, 195.490 96.250, 192.908 99 M 80.750 101.566 C 80.338 101.988, 80 103.101, 80 104.039 C 80 105.257, 78.786 105.966, 75.750 106.520 L 71.500 107.296 75.673 108.274 C 78.941 109.039, 79.998 109.821, 80.546 111.876 L 81.247 114.500 82.185 111.816 C 82.835 109.955, 84.100 108.905, 86.311 108.393 L 89.500 107.654 86.408 106.728 C 84.507 106.158, 82.967 104.838, 82.408 103.300 C 81.909 101.924, 81.162 101.143, 80.750 101.566 M 129 106.441 C 129 107.234, 129.450 108.160, 130 108.500 C 130.550 108.840, 131 108.191, 131 107.059 C 131 105.927, 130.550 105, 130 105 C 129.450 105, 129 105.648, 129 106.441 M 132 107.559 C 132 109.010, 132.433 109.851, 133 109.500 C 133.550 109.160, 134 108.009, 134 106.941 C 134 105.873, 133.550 105, 133 105 C 132.450 105, 132 106.152, 132 107.559 M 106.948 116.613 C 103.401 119.081, 100.500 121.634, 100.500 122.287 C 100.500 124.749, 104.011 123.988, 108.918 120.463 L 114.001 116.812 120.889 121.917 C 124.748 124.778, 128.406 126.781, 129.209 126.473 C 129.997 126.171, 135.631 128.392, 141.728 131.409 C 151.995 136.490, 159.715 140, 160.622 140 C 160.830 140, 161 139.324, 161 138.499 C 161 137.548, 154.987 134.083, 144.595 129.046 C 135.573 124.673, 125.110 119.220, 121.345 116.929 C 117.580 114.637, 114.251 112.619, 113.948 112.444 C 113.644 112.269, 110.494 114.146, 106.948 116.613 M 202.129 122.961 C 204.582 126.278, 206 126.088, 206 122.441 C 206 120.390, 205.516 120, 202.970 120 L 199.940 120 202.129 122.961 M 48.589 134.500 C 49.061 136.380, 48.823 137, 47.630 137 C 46.283 137, 46.223 137.394, 47.229 139.603 L 48.415 142.206 50.222 139.974 C 51.606 138.265, 51.763 137.420, 50.893 136.371 C 50.038 135.341, 50.064 134.627, 51 133.500 C 52.041 132.246, 51.894 132, 50.103 132 C 48.318 132, 48.066 132.416, 48.589 134.500 M 89.694 149.639 C 87.783 151.550, 92.237 152, 113.059 152 C 132.784 152, 136 151.790, 136 150.500 C 136 149.210, 132.796 149, 113.167 149 C 100.608 149, 90.046 149.288, 89.694 149.639 M 52 152.934 C 52 153.447, 53.192 154.010, 54.649 154.184 C 60.718 154.908, 60.175 161.642, 54.071 161.348 C 51.472 161.223, 51.122 161.442, 52.081 162.598 C 52.721 163.369, 54.245 164, 55.467 164 C 60.328 164, 62.842 156.977, 59.171 153.655 C 57.225 151.894, 52 151.368, 52 152.934 M 170.465 153.930 C 165.313 156.073, 163.907 162.887, 167.944 166.156 C 172.769 170.063, 182 166.743, 182 161.101 C 182 156.419, 174.977 152.053, 170.465 153.930 M 46 156.899 C 46 157.693, 54.954 159.049, 55.850 158.390 C 56.043 158.249, 55.904 157.653, 55.541 157.067 C 54.745 155.778, 46 155.624, 46 156.899 M 169.750 157.080 C 165.999 159.265, 168.961 166, 173.674 166 C 177.775 166, 180.592 159.992, 177.800 157.200 C 176.347 155.747, 172.147 155.684, 169.750 157.080 M 110 160 C 110 160.584, 113.353 161, 118.059 161 C 123.177 161, 125.892 160.635, 125.500 160 C 125.160 159.450, 121.534 159, 117.441 159 C 113.147 159, 110 159.423, 110 160 M 171.570 159.887 C 170.661 161.357, 173.907 163.493, 175.155 162.245 C 175.744 161.656, 175.923 160.685, 175.554 160.087 C 174.744 158.777, 172.331 158.655, 171.570 159.887 M 153 161.378 C 153 161.585, 153.615 162.266, 154.367 162.890 C 155.407 163.753, 156.035 163.663, 156.990 162.512 C 158.056 161.228, 157.850 161, 155.622 161 C 154.180 161, 153 161.170, 153 161.378 M 68.584 171.641 C 68.057 173.014, 68.204 173.076, 69.477 172.019 C 71.212 170.579, 71.393 170, 70.107 170 C 69.616 170, 68.931 170.739, 68.584 171.641 M 72 170.378 C 72 170.585, 72.685 171.324, 73.523 172.019 C 74.796 173.076, 74.943 173.014, 74.416 171.641 C 73.878 170.240, 72 169.257, 72 170.378 M 159.250 171.662 C 158.563 171.940, 158 172.890, 158 173.774 C 158 175.103, 158.260 175.046, 159.500 173.441 C 160.985 171.520, 161.015 171.520, 162.500 173.441 C 163.325 174.509, 164 174.936, 164 174.391 C 164 173.295, 161.916 170.955, 161.050 171.079 C 160.748 171.122, 159.938 171.385, 159.250 171.662"
                stroke="none"
                fill="#074C51"
                fillRule="evenodd"
              />
              <path
                d="M 0 102.004 L 0 204.008 117.750 203.754 L 235.500 203.500 235.755 101.750 L 236.009 0 118.005 0 L 0 0 0 102.004 M 0.481 102.500 C 0.481 158.600, 0.602 181.403, 0.750 153.174 C 0.897 124.944, 0.897 79.044, 0.750 51.174 C 0.602 23.303, 0.481 46.400, 0.481 102.500 M 92.449 9.083 C 92.137 9.587, 92.160 10.450, 92.500 11 C 93.378 12.421, 149.662 12.356, 150.541 10.933 C 150.904 10.347, 150.990 9.656, 150.732 9.399 C 149.810 8.476, 93.014 8.169, 92.449 9.083 M 174.022 14.477 C 171.746 16.899, 171.319 16.960, 154.845 17.227 C 144.676 17.392, 137.898 17.896, 137.748 18.500 C 137.588 19.146, 148.412 19.594, 168.338 19.765 C 192.844 19.975, 199.091 19.769, 198.759 18.765 C 198.499 17.978, 196.060 17.389, 192.303 17.206 C 187.409 16.967, 185.828 16.446, 183.958 14.456 C 180.975 11.280, 177.017 11.288, 174.022 14.477 M 69.333 17.576 C 68.180 20.580, 74.133 27.275, 81.040 30.742 C 84.593 32.525, 87.950 34.156, 88.500 34.367 C 89.050 34.578, 87.803 36.522, 85.730 38.688 C 83.656 40.854, 82.268 42.935, 82.646 43.313 C 84.065 44.731, 89.680 43.897, 94.821 41.503 L 100.142 39.026 106.131 41.044 C 115.286 44.128, 141.214 50.985, 143.750 50.993 C 147.172 51.004, 146.457 49.320, 141.750 46.285 L 137.500 43.545 142.500 42.860 C 145.250 42.483, 153.912 42.136, 161.750 42.088 C 175.304 42.004, 176 41.902, 176 40 C 176 38.057, 175.333 38, 152.500 38 C 128.930 38, 123.953 37.195, 134.250 35.049 C 137.137 34.447, 142.114 33.403, 145.310 32.727 C 155.782 30.515, 151.440 29.500, 131.500 29.500 L 112.500 29.500 102 24.656 C 87.325 17.885, 81.513 16, 75.312 16 C 71.342 16, 69.779 16.412, 69.333 17.576 M 49 27 C 49 27.550, 49.450 28, 50 28 C 50.550 28, 51 27.550, 51 27 C 51 26.450, 50.550 26, 50 26 C 49.450 26, 49 26.450, 49 27 M 53.500 27 C 53.160 27.550, 53.359 28, 53.941 28 C 54.523 28, 55 27.550, 55 27 C 55 26.450, 54.802 26, 54.559 26 C 54.316 26, 53.840 26.450, 53.500 27 M 170 28.500 C 170 29.667, 171.333 30, 176 30 C 180.667 30, 182 29.667, 182 28.500 C 182 27.333, 180.667 27, 176 27 C 171.333 27, 170 27.333, 170 28.500 M 39 39.875 C 39 41.291, 38.205 41.975, 36.250 42.241 L 33.500 42.614 36.250 43.782 C 37.763 44.425, 39 45.637, 39 46.475 C 39 47.314, 39.450 48, 40 48 C 40.550 48, 41 47.152, 41 46.117 C 41 45.050, 41.976 43.911, 43.250 43.490 L 45.500 42.746 43.250 42.303 C 42.013 42.060, 41 41.244, 41 40.489 C 41 39.735, 40.550 38.840, 40 38.500 C 39.450 38.160, 39 38.779, 39 39.875 M 185 39 C 185 39.584, 188.353 40, 193.059 40 C 198.177 40, 200.892 39.635, 200.500 39 C 200.160 38.450, 196.534 38, 192.441 38 C 188.147 38, 185 38.423, 185 39 M 181 47 C 181 47.550, 181.450 48, 182 48 C 182.550 48, 183 47.550, 183 47 C 183 46.450, 182.550 46, 182 46 C 181.450 46, 181 46.450, 181 47 M 194 49 C 194 49.550, 194.477 50, 195.059 50 C 195.641 50, 195.840 49.550, 195.500 49 C 195.160 48.450, 194.684 48, 194.441 48 C 194.198 48, 194 48.450, 194 49 M 57.867 50.988 C 52.949 53.614, 46.612 61.013, 45.176 65.807 C 44.529 67.966, 44 71.731, 44 74.175 C 44 76.618, 43.366 79.485, 42.590 80.546 C 41.241 82.391, 41.097 82.398, 39.232 80.710 C 37.850 79.460, 37.109 77.074, 36.682 72.502 C 35.829 63.359, 31.597 55.768, 25.124 51.768 C 21.821 49.726, 21.679 49.719, 20.360 51.523 C 17.366 55.617, 19.613 66.019, 24.800 72.079 C 26.775 74.387, 30.891 77.854, 33.946 79.784 C 37.001 81.714, 39.662 83.426, 39.859 83.589 C 40.057 83.752, 39.220 85.286, 38.001 86.999 C 35.871 89.989, 35.706 90.044, 33.859 88.373 C 32.801 87.415, 31.032 85.170, 29.928 83.384 C 25.710 76.559, 11.179 70.228, 6.042 72.977 C 4.158 73.986, 4.105 74.303, 5.401 76.809 C 9.157 84.073, 17.293 89.013, 26.748 89.772 C 30.216 90.050, 33.261 90.613, 33.513 91.022 C 34.233 92.187, 30.032 97, 28.295 97 C 27.438 97, 25.110 95.995, 23.122 94.767 C 18.627 91.988, 10.055 91.777, 5.250 94.327 C 1.252 96.448, 1.141 98.061, 4.841 100.247 C 10.253 103.444, 15.377 103.540, 21.471 100.558 C 24.497 99.077, 27.381 98.117, 27.878 98.425 C 28.376 98.732, 27.711 101.575, 26.401 104.742 C 25.090 107.909, 23.732 112.188, 23.381 114.250 C 22.433 119.835, 21 118.782, 21 112.500 C 21 109.475, 20.550 107, 20 107 C 18.567 107, 18.798 116.383, 20.418 124.024 C 28.389 161.621, 60.013 190.437, 100 196.539 C 117.351 199.186, 133.038 197.729, 149.625 191.928 C 180.317 181.196, 203.316 156.158, 209.557 126.685 C 211.407 117.946, 211.540 118.628, 207.616 116.757 C 205.756 115.870, 202.588 113.699, 200.578 111.934 L 196.922 108.724 194.684 110.827 C 192.236 113.126, 189.804 112.929, 184.500 110.002 C 182.850 109.091, 178.437 106.641, 174.694 104.556 L 167.889 100.766 156.194 108.506 C 143.259 117.068, 139.801 119.869, 140.590 121.145 C 141.755 123.031, 144.672 121.649, 156.141 113.780 L 168.121 105.560 176.100 109.869 C 181.727 112.909, 184.437 113.882, 185.293 113.172 C 186.123 112.483, 187.082 112.587, 188.332 113.501 C 189.793 114.569, 189.942 115.239, 189.079 116.852 C 187.561 119.689, 187.645 119.836, 190.981 120.187 L 193.962 120.500 190.808 125.334 C 188.415 129.002, 187.963 130.359, 188.937 130.961 C 189.904 131.559, 189.302 133.198, 186.489 137.627 C 184.437 140.857, 182.547 143.725, 182.289 144 C 181.638 144.695, 177.011 138.784, 177.005 137.250 C 177.002 136.563, 177.675 136, 178.500 136 C 180.485 136, 180.393 135.316, 178 132.273 C 175.374 128.935, 175.477 128, 178.469 128 C 180.891 128, 180.859 127.893, 176.765 122.420 L 172.592 116.840 168.334 121.670 C 165.993 124.326, 164.060 126.838, 164.038 127.250 C 164.017 127.662, 165.162 128, 166.582 128 L 169.163 128 166.966 131.555 C 164.954 134.810, 164.907 135.212, 166.410 136.311 C 167.891 137.394, 167.712 138.048, 164.576 143.005 C 161.940 147.171, 161.451 148.578, 162.550 148.823 C 164.592 149.279, 164.360 150.313, 161.644 152.865 L 159.288 155.078 153.531 147.952 L 147.773 140.826 144.636 145.284 C 142.911 147.736, 139.925 151.938, 138 154.621 C 136.075 157.305, 134.350 159.838, 134.167 160.250 C 133.983 160.662, 135.951 161, 138.539 161 C 142.801 161, 143.116 161.156, 141.874 162.652 C 141.119 163.561, 138.112 166.070, 135.190 168.229 C 126.526 174.630, 126.896 176.234, 137.637 178.837 C 141.412 179.752, 144.323 180.950, 144.106 181.500 C 143.889 182.050, 141.668 183.276, 139.170 184.224 C 136.673 185.172, 132.668 187.872, 130.271 190.224 L 125.912 194.500 114.080 194.364 C 101.591 194.220, 96.811 192.974, 96.180 189.694 C 95.669 187.041, 97.503 185.399, 102.562 183.983 C 110.076 181.879, 111.774 177.163, 105.771 175.070 C 102.098 173.790, 86.075 173.666, 84.122 174.904 C 81.098 176.819, 84.318 178, 92.559 178 C 99.395 178, 101 178.285, 101 179.500 C 101 181.733, 83.813 181.670, 81.571 179.429 C 79.353 177.210, 79.621 174.379, 82.223 172.557 C 83.984 171.323, 87.427 171, 98.806 171 C 109.848 171, 113.071 170.711, 112.754 169.750 C 112.487 168.943, 109.263 168.288, 103.666 167.901 C 97.325 167.464, 94.455 166.817, 92.996 165.496 C 90.774 163.485, 90.395 161.368, 92.153 160.782 C 93.179 160.440, 89.560 154.123, 84.542 147.500 C 83.120 145.623, 82.962 145.607, 81.964 147.250 C 81.240 148.442, 79.641 149, 76.950 149 C 74.106 149, 73 149.420, 73 150.500 C 73 151.433, 73.944 152, 75.500 152 C 78.490 152, 78.677 153.077, 76.094 155.415 C 74.274 157.062, 74.037 157.002, 70.844 154.085 C 68.053 151.535, 67.748 150.868, 69 150.050 C 70.316 149.190, 70.281 148.729, 68.708 146.285 C 64.786 140.187, 63.429 136.701, 64.800 136.239 C 65.833 135.890, 65.792 135.331, 64.595 133.505 C 63.194 131.367, 63.242 131.169, 65.296 130.618 C 69.197 129.572, 71.847 129.952, 76.099 132.169 C 79.722 134.057, 80.049 134.491, 78.630 135.529 C 76.508 137.080, 76.541 139, 78.688 139 C 81.020 139, 97 128.811, 97 127.324 C 97 124.640, 94.595 124.986, 89.436 128.411 L 84 132.020 77.750 129.187 C 72.970 127.021, 70.813 126.538, 68.580 127.136 C 65.315 128.010, 64.657 127.428, 60.792 120.250 C 59.533 117.912, 58.278 116.014, 58.002 116.032 C 56.958 116.097, 52 125.209, 52 127.062 C 52 128.128, 51.663 129.006, 51.250 129.014 C 50.837 129.021, 49.522 129.290, 48.326 129.610 C 46.621 130.068, 45.811 129.536, 44.576 127.146 C 42.615 123.355, 42.616 123, 44.590 123 C 45.847 123, 45.461 121.691, 42.750 116.750 C 40.864 113.313, 38.951 110.500, 38.500 110.500 C 38.049 110.500, 36.136 113.313, 34.250 116.750 C 31.539 121.691, 31.153 123, 32.410 123 C 34.366 123, 34.378 123.369, 32.537 126.928 C 31.073 129.759, 28.249 131.584, 27.107 130.438 C 26.773 130.103, 26.514 125.705, 26.531 120.664 C 26.556 113.254, 27.034 110.352, 29.031 105.500 C 31.148 100.356, 31.907 99.453, 34.354 99.174 C 36.149 98.968, 38.004 99.571, 39.354 100.799 C 44.068 105.086, 48.907 106.013, 56 103.991 C 62.454 102.151, 62.909 101.293, 59.150 98.064 C 55.299 94.757, 48.236 92.660, 44.241 93.637 C 42.733 94.005, 39.952 95.127, 38.059 96.130 C 36.167 97.132, 34.408 97.741, 34.150 97.483 C 33.192 96.525, 42.826 85.488, 44.890 85.178 C 46.068 85.001, 48.712 85.901, 50.766 87.178 C 53.807 89.069, 55.893 89.500, 62 89.500 C 68.555 89.500, 70.193 89.107, 75 86.380 C 82.175 82.311, 82.301 80.134, 75.500 77.740 C 69.289 75.554, 61.680 75.925, 56.404 78.671 C 54.257 79.788, 51.043 81.474, 49.263 82.418 C 47.482 83.362, 45.587 83.863, 45.050 83.531 C 43.351 82.481, 46.133 78.076, 49.922 75.818 C 58.712 70.580, 64.700 61.977, 65.222 53.839 C 65.459 50.134, 65.208 49.467, 63.500 49.274 C 62.400 49.150, 59.865 49.921, 57.867 50.988 M 87.500 53.864 C 85.850 54.885, 83.259 57.133, 81.742 58.860 C 79.828 61.040, 78.087 62, 76.051 62 C 74.438 62, 72.823 62.478, 72.462 63.062 C 72.101 63.646, 70.688 64.548, 69.322 65.068 C 67.955 65.587, 67.024 66.572, 67.252 67.256 C 67.565 68.197, 74.152 68.565, 94.333 68.766 C 117.164 68.994, 121 68.823, 121 67.573 C 121 65.891, 117.279 63.018, 115.027 62.962 C 114.187 62.941, 112.324 61.222, 110.887 59.141 C 109.450 57.060, 106.682 54.602, 104.736 53.679 C 99.942 51.404, 91.325 51.497, 87.500 53.864 M 99.242 55.327 C 101.301 55.972, 103.893 57.288, 105.004 58.250 C 107.558 60.464, 108.677 60.521, 106.872 58.345 C 105.250 56.389, 99.810 53.968, 97.282 54.077 C 96.302 54.119, 97.184 54.682, 99.242 55.327 M 157 55.500 C 157 56.787, 160.056 57, 178.500 57 C 197.963 57, 203.059 56.388, 198.418 54.607 C 197.548 54.273, 187.873 54, 176.918 54 C 159.880 54, 157 54.217, 157 55.500 M 203.270 60.212 C 202.044 60.803, 200.471 62.573, 199.776 64.144 C 198.367 67.327, 195.671 67.822, 192.559 65.468 C 189.761 63.352, 184.377 63.623, 182 66 C 180.900 67.100, 180 68.450, 180 69 C 180 69.635, 172.333 70, 159 70 C 141 70, 138 70.214, 138 71.500 C 138 72.812, 143.778 73, 184 73 C 224.222 73, 230 72.812, 230 71.500 C 230 70.440, 228.900 69.989, 226.250 69.962 C 223.017 69.929, 222.115 69.368, 219.712 65.895 C 215.610 59.968, 208.714 57.584, 203.270 60.212 M 88 74.500 C 88 75.875, 88.450 77, 89 77 C 89.550 77, 90 75.875, 90 74.500 C 90 73.125, 89.550 72, 89 72 C 88.450 72, 88 73.125, 88 74.500 M 93 75 C 93 76.650, 93.450 78, 94 78 C 94.550 78, 95 76.650, 95 75 C 95 73.350, 94.550 72, 94 72 C 93.450 72, 93 73.350, 93 75 M 98.548 73.250 C 98.129 74.213, 98.129 75.787, 98.548 76.750 C 99.273 78.417, 99.329 78.417, 99.728 76.750 C 99.958 75.787, 99.958 74.213, 99.728 73.250 C 99.329 71.583, 99.273 71.583, 98.548 73.250 M 93 85.476 C 93 86.349, 92.325 87.322, 91.500 87.638 C 89.516 88.400, 89.608 89.686, 91.852 92.539 L 93.703 94.893 95.728 92.154 L 97.753 89.415 95.377 86.652 C 93.700 84.702, 93 84.356, 93 85.476 M 124.001 85.752 C 119.907 87.797, 117.611 91.951, 118.453 95.786 C 118.781 97.279, 121.288 101.125, 124.025 104.331 C 126.761 107.538, 129 111.025, 129 112.081 C 129 115.080, 133.615 114.670, 134.385 111.603 C 134.716 110.284, 136.624 107.247, 138.626 104.853 C 140.628 102.459, 142.965 99.037, 143.818 97.250 C 145.236 94.282, 145.223 93.692, 143.675 90.445 C 140.779 84.371, 131.293 82.108, 124.001 85.752 M 190.441 85.468 C 189.071 86.505, 185.804 86.946, 179.332 86.968 C 174.289 86.986, 169.452 87.273, 168.582 87.607 C 163.922 89.395, 169.082 90, 189 90 C 203 90, 211 89.636, 211 89 C 211 88.450, 209.833 88, 208.408 88 C 206.982 88, 204.671 87.100, 203.273 86 C 200.226 83.603, 193.287 83.316, 190.441 85.468 M 192.908 99 C 190.326 101.750, 187.678 104, 187.023 104 C 186.369 104, 186.021 104.563, 186.250 105.250 C 186.776 106.827, 215.982 107.072, 216.031 105.500 C 216.048 104.950, 214.956 104.361, 213.605 104.191 C 212.220 104.016, 210 102.378, 208.522 100.440 C 205.954 97.073, 201.339 94, 198.851 94 C 198.164 94, 195.490 96.250, 192.908 99 M 80.750 101.566 C 80.338 101.988, 80 103.101, 80 104.039 C 80 105.257, 78.786 105.966, 75.750 106.520 L 71.500 107.296 75.673 108.274 C 78.941 109.039, 79.998 109.821, 80.546 111.876 L 81.247 114.500 82.185 111.816 C 82.835 109.955, 84.100 108.905, 86.311 108.393 L 89.500 107.654 86.408 106.728 C 84.507 106.158, 82.967 104.838, 82.408 103.300 C 81.909 101.924, 81.162 101.143, 80.750 101.566 M 129 106.441 C 129 107.234, 129.450 108.160, 130 108.500 C 130.550 108.840, 131 108.191, 131 107.059 C 131 105.927, 130.550 105, 130 105 C 129.450 105, 129 105.648, 129 106.441 M 132 107.559 C 132 109.010, 132.433 109.851, 133 109.500 C 133.550 109.160, 134 108.009, 134 106.941 C 134 105.873, 133.550 105, 133 105 C 132.450 105, 132 106.152, 132 107.559 M 106.948 116.613 C 103.401 119.081, 100.500 121.634, 100.500 122.287 C 100.500 124.749, 104.011 123.988, 108.918 120.463 L 114.001 116.812 120.889 121.917 C 124.748 124.778, 128.406 126.781, 129.209 126.473 C 129.997 126.171, 135.631 128.392, 141.728 131.409 C 151.995 136.490, 159.715 140, 160.622 140 C 160.830 140, 161 139.324, 161 138.499 C 161 137.548, 154.987 134.083, 144.595 129.046 C 135.573 124.673, 125.110 119.220, 121.345 116.929 C 117.580 114.637, 114.251 112.619, 113.948 112.444 C 113.644 112.269, 110.494 114.146, 106.948 116.613 M 202.129 122.961 C 204.582 126.278, 206 126.088, 206 122.441 C 206 120.390, 205.516 120, 202.970 120 L 199.940 120 202.129 122.961 M 48.589 134.500 C 49.061 136.380, 48.823 137, 47.630 137 C 46.283 137, 46.223 137.394, 47.229 139.603 L 48.415 142.206 50.222 139.974 C 51.606 138.265, 51.763 137.420, 50.893 136.371 C 50.038 135.341, 50.064 134.627, 51 133.500 C 52.041 132.246, 51.894 132, 50.103 132 C 48.318 132, 48.066 132.416, 48.589 134.500 M 89.694 149.639 C 87.783 151.550, 92.237 152, 113.059 152 C 132.784 152, 136 151.790, 136 150.500 C 136 149.210, 132.796 149, 113.167 149 C 100.608 149, 90.046 149.288, 89.694 149.639 M 52 152.934 C 52 153.447, 53.192 154.010, 54.649 154.184 C 60.718 154.908, 60.175 161.642, 54.071 161.348 C 51.472 161.223, 51.122 161.442, 52.081 162.598 C 52.721 163.369, 54.245 164, 55.467 164 C 60.328 164, 62.842 156.977, 59.171 153.655 C 57.225 151.894, 52 151.368, 52 152.934 M 170.465 153.930 C 165.313 156.073, 163.907 162.887, 167.944 166.156 C 172.769 170.063, 182 166.743, 182 161.101 C 182 156.419, 174.977 152.053, 170.465 153.930 M 46 156.899 C 46 157.693, 54.954 159.049, 55.850 158.390 C 56.043 158.249, 55.904 157.653, 55.541 157.067 C 54.745 155.778, 46 155.624, 46 156.899 M 169.750 157.080 C 165.999 159.265, 168.961 166, 173.674 166 C 177.775 166, 180.592 159.992, 177.800 157.200 C 176.347 155.747, 172.147 155.684, 169.750 157.080 M 110 160 C 110 160.584, 113.353 161, 118.059 161 C 123.177 161, 125.892 160.635, 125.500 160 C 125.160 159.450, 121.534 159, 117.441 159 C 113.147 159, 110 159.423, 110 160 M 171.570 159.887 C 170.661 161.357, 173.907 163.493, 175.155 162.245 C 175.744 161.656, 175.923 160.685, 175.554 160.087 C 174.744 158.777, 172.331 158.655, 171.570 159.887 M 153 161.378 C 153 161.585, 153.615 162.266, 154.367 162.890 C 155.407 163.753, 156.035 163.663, 156.990 162.512 C 158.056 161.228, 157.850 161, 155.622 161 C 154.180 161, 153 161.170, 153 161.378 M 68.584 171.641 C 68.057 173.014, 68.204 173.076, 69.477 172.019 C 71.212 170.579, 71.393 170, 70.107 170 C 69.616 170, 68.931 170.739, 68.584 171.641 M 72 170.378 C 72 170.585, 72.685 171.324, 73.523 172.019 C 74.796 173.076, 74.943 173.014, 74.416 171.641 C 73.878 170.240, 72 169.257, 72 170.378 M 159.250 171.662 C 158.563 171.940, 158 172.890, 158 173.774 C 158 175.103, 158.260 175.046, 159.500 173.441 C 160.985 171.520, 161.015 171.520, 162.500 173.441 C 163.325 174.509, 164 174.936, 164 174.391 C 164 173.295, 161.916 170.955, 161.050 171.079 C 160.748 171.122, 159.938 171.385, 159.250 171.662"
                stroke="none"
                fill="#F6EBD9"
                fillRule="evenodd"
              />
            </svg>
            <p className="h-11 w-28 text-wrap text-2xl font-black uppercase leading-6 text-dark-green">
              {t('title')}
            </p>
          </div>
          <div className="ml-72 flex h-full items-center space-x-1">
            <div className="flex h-full w-10 cursor-pointer items-center justify-center hover:text-dark-green-300">
              <MagnifyingGlass size={26} weight="bold" />
            </div>
            <div className="flex h-full w-10 cursor-pointer items-center justify-center hover:text-dark-green-300">
              <Link href={PROFILE_PAGE}>
                <User size={26} weight="bold" />
              </Link>
            </div>
            <button
              aria-label="Cart"
              type="button"
              className="flex h-full w-10 cursor-pointer items-center justify-center hover:text-dark-green-300"
              onClick={handleOpenCart}
            >
              <ShoppingCart size={26} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
