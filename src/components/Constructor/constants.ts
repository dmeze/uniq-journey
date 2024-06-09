import * as Yup from 'yup'

export const colorsMap = [
  '#5f5d9c',
  '#6196a6',
  '#a4ce95',
  '#f4edcc',
  '#3aa6b9',
  '#ffd0d0',
  '#ff9eaa',
  '#891652',
  '#f6995c',
]

export const perfumeDetailsFields = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
  },
  {
    id: 'description',
    label: 'Description',
    type: 'text',
  },
]

export const noteTypes = [
  {
    id: 'baseNotes',
    label: 'Base Note',
  },
  {
    id: 'middleNotes',
    label: 'Middle Note',
  },
  {
    id: 'topNotes',
    label: 'Top Note',
  },
]

export const nameDescriptionValidationSchema = Yup.object().shape({
  name: Yup.string().required('Title is required.'),
  description: Yup.string().required('Description is required.'),
})

export const imageValidationSchema = Yup.object().shape({
  image: Yup.mixed().required('Image is required.'),
})
