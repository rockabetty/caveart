import CaveartLayout from '../../../app/user_interface/CaveartLayout'
import { useRouter } from 'next/router'
import { useCallback, useState, useEffect } from 'react'
import { Image, Icon, DropdownSelect } from '@components'
import axios from 'axios'
import PageNavigator from '../../../app/user_interface/comic/pages/PageNavigator'

function ReaderPage() {

  const router = useRouter()
  const {tenant, number} = router.query
 
  const [lastPageNumber, setLastPageNumber] = useState(0)

  useEffect(() => {
    const getLast = async () => {
      if (tenant && number) {
        try {
          const lastPageNumberRequest = await axios.get(`/api/comic/${tenant}/page/last`);
          const lastPage = lastPageNumberRequest.data.number;
          setLastPageNumber(lastPage);
        } catch (error) {
          console.error("comicPages.newPage.generalError");
        }
      }
    }
    getLast()
  },[tenant, number]);
 
  return (
    <CaveartLayout>
      <h1>{tenant} {number}</h1> 
      <figure>
        <Image width={"100%"} />
        <figcaption>
        </figcaption>
      </figure>

      <PageNavigator current={number} last={lastPageNumber}/>

    </CaveartLayout>
  )
}

export default ReaderPage;