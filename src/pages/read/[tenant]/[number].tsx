import CaveartLayout from '../../../app/user_interface/CaveartLayout'
import { useRouter } from 'next/router'
import { useCallback, useState, useEffect } from 'react'
import { Image, Icon, DropdownSelect } from '@components'
import axios from 'axios'
import PageNavigator from '../../../app/user_interface/comic/pages/PageNavigator'

function ReaderPage() {

  const router = useRouter()
  const {tenant, number} = router.query
  const currentPage = Number(number)
 
  const [lastPageNumber, setLastPageNumber] = useState(0)
  const [pageData, setPageData] = useState()

  useEffect(() => {
    const getPage = async () => {
      if (currentPage) {
        try {
          const comicPageRequest = await axios.get(`/api/comic/${tenant}/pages/read/${currentPage}`)
          setPageData(comicPageRequest.data)
        } catch (error) {
          console.error("comicPages.readPage.generalError")
        }
      }
    }
    getPage()
  },[currentPage]);

 useEffect(() => {
    const getLast = async () => {
      if (tenant) {
        try {
          const lastPageNumberRequest = await axios.get(`/api/comic/${tenant}/pages/last`);
          const lastPage = lastPageNumberRequest.data.number;
          setLastPageNumber(lastPage);
        } catch (error) {
          console.error("comicPages.newPage.generalError");
        }
      }
    }
    getLast()
  },[tenant]);
 
  return (
    <CaveartLayout>
      <h1>{tenant} {number}</h1> 
      <figure>
        <Image width={"100%"} />
        <figcaption>
        </figcaption>
      </figure>

      <PageNavigator current={currentPage} last={lastPageNumber}/>

    </CaveartLayout>
  )
}

export default ReaderPage;