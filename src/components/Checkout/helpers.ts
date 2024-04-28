import axios from 'axios'

export const getWarehouseOptions = (cityRef: string, inputValue: string) =>
  axios
    .post('https://api.novaposhta.ua/v2.0/json/', {
      modelName: 'Address',
      calledMethod: 'getWarehouses',
      methodProperties: {
        SettlementRef: cityRef,
        FindByString: inputValue,
        Limit: 10,
      },
    })
    .then(({ data }) =>
      data?.data?.map(
        ({ Description, Ref }: { Description: string; Ref: string }) => ({
          label: Description,
          value: Ref,
        }),
      ),
    )

export const getCityRef = (inputValue: string) =>
  axios
    .post('https://api.novaposhta.ua/v2.0/json/', {
      modelName: 'Address',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: inputValue,
      },
    })
    .then(({ data }) => {
      return data?.data[0]?.Addresses?.map(
        ({ Present, Ref }: { Present: string; Ref: string }) => ({
          label: Present,
          value: Ref,
        }),
      )
    })
