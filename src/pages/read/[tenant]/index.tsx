import CaveartLayout from '../../../app/user_interface/CaveartLayout'
import { useRouter } from 'next/router'
import { useCallback, useState, useEffect } from 'react'
import { Image, Icon, DropdownSelect } from '@components'
import axios from 'axios'

function ReaderPage() {

  const router = useRouter()
  const {tenant} = router.query
  const options = [
  {
    value: "1",
    labelText: "Page Name"
  },
  {
    value: "2",
    labelText: "Page Name 2"
  }
  ];

  const [pageNumbers, setPageNumbers] = useState({
    previous: 0,
    next: 0,
    last: 0
  })

  useEffect(() => {
    const getLast = async () => {
      if (tenant) {
        try {
          const lastPageNumberRequest = await axios.get(`/api/comic/${tenant}/pages/last`);
          const { number } = lastPageNumberRequest.data;
          setPageNumbers((pageNumbers) => {
            return { ...pageNumbers, last: number}
          });
        } catch (error) {
          console.error("comicPages.newPage.generalError");
        }
      }
    }

    getLast()
  },[tenant]);
 
  return (
    <CaveartLayout>
      <h1>{tenant}</h1>

      <figure>
        <Image width={"100%"} />
        <figcaption>
        </figcaption>
      </figure>


      <a href="1">
        <Icon name="doubleLeft"/>
      </a>
      <Icon name="caratLeft"/>
      <DropdownSelect
        labelText="Page Selection" 
        value={"2"}
        options={options}
      />
      <Icon name="caratRight"/>
      <a href={pageNumbers.last}><Icon name="doubleRight"/></a>

    </CaveartLayout>
  )
}

export default ReaderPage;