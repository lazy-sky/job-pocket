import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
  fetchJobCategories,
  fetchJobTypeCategories,
  fetchLocationCategories,
  requestSearch,
} from '../apis/search';
import CategoryModal from '../components/CategoryModal';
import SearchBar from '../components/SearchBar';
import { Container } from '../components/styled';
import useInput from '../hooks/useInput';
import mixins from '../styles/mixins';

const LoginButton = styled.button`
  ${mixins.fontStyle.body_04};  
  position: fixed;
  top: 20px;
  right: 24px;
  padding: 8px 20px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.blue_02};
  border: none;
  border-radius: 4px;

  a {
    text-decoration: none; 
    color: ${({ theme }) => theme.colors.white}; 
  }
`;

const MyPageButton = styled.button`
  position: fixed;
  top: 20px;
  right: 24px;
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  background-color: inherit;
`;

const LogoBox = styled.div`
  margin-top: 40vh;
  text-align: center;
`;

export const Form = styled.form`
  margin-top: 20px;
`;

export const SearchCategories = styled.ul`
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  overflow: auto;

  li {
    flex: 0 0 auto;
  }
`;

export const SearchCategory = styled.li`
  ${mixins.fontStyle.body_08};
  display: flex;
  flex-wrap: nowrap;
  gap: 6px; 
  overflow: auto;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.blue_03};
  box-sizing: border-box;
  border-radius: 6px;
`;

export const SearchCategoryName = styled.div`
  color: ${({ theme }) => theme.colors.grayscale_02};
`;

export const SearchCategorySelected = styled.div`
  color: ${({ theme }) => theme.colors.blue_01};
`;

function Home({ token }: {
  token: string | null
}) {
  const navigate = useNavigate();
  const [keyword, handleKeyword] = useInput('');
  const [job, setJob] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [sort, setSort] = useState('?????????');

  const [jobs, setJobs] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const sorts = ['?????????', '?????????'];

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isWorkTypeModalOpen, setIsWorkTypeModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  useEffect(() => {
    (function() {
      if (window.localStorage) {
        if (!localStorage.getItem('firstLoad')) {
          localStorage['firstLoad'] = true;
          window.location.reload();
        } else { localStorage.removeItem('firstLoad'); }
      }
    })();
  }, []);

  // ???????????? ????????????
  useEffect(() => {
    (async () => {
      const res = await fetchJobCategories();
      setJobs(res);
    })();

    (async () => {
      const res = await fetchJobTypeCategories();
      setJobTypes(res);
    })();

    (async () => {
      const res = await fetchLocationCategories();
      setLocations(res);
    })();
  }, []);

  const openModal = (category: string) => {
    if (category === '??????') {
      setIsJobModalOpen(true);
    }

    if (category === '??????') {
      setIsLocationModalOpen(true);
    }

    if (category === '?????? ??????') {
      setIsWorkTypeModalOpen(true);
    }

    if (category === '??????') {
      setIsSortModalOpen(true);
    }
  };

  const closeModal = (category: string) => {
    if (category === '??????') {
      setIsJobModalOpen(false);
    }

    if (category === '??????') {
      setIsLocationModalOpen(false);
    }

    if (category === '?????? ??????') {
      setIsWorkTypeModalOpen(false);
    }

    if (category === '??????') {
      setIsSortModalOpen(false);
    }
  };

  const handleSearch = async () => {
    let sorting = 'pd';
    if (sort === '?????????') {
      sorting = 'rc';
    }

    const searchParams = {
      keyword,
      start: 0,
      count: 10,
      job,
      loc_mcd: location,
      loc_bcd: location,
      jobType,
      sort: sorting,
    };
    const { jobs } = await requestSearch(searchParams);
    console.log(jobs);
    return jobs;
  };

  return (
    <>
      <Container>
        {!token
          ? <LoginButton onClick={() => navigate('/signin')}>
            ?????????
          </LoginButton>
          : <MyPageButton>
            <Link to="/signin">
              <img src="images/icon_my.png" alt="" />
            </Link>
          </MyPageButton>}
        <LogoBox>
          <img src="images/logo.png" alt="???????????? ??????" />
        </LogoBox>
        <Form>
          <Link to="/search">
            <SearchBar
              keyword={keyword}
              handleKeyword={handleKeyword}
              handleSearch={handleSearch}
            />
          </Link>
          <SearchCategories>
            <SearchCategory onClick={() => openModal('??????')}>
              <SearchCategoryName>??????</SearchCategoryName>
              <SearchCategorySelected>
                {job || '??????'}
              </SearchCategorySelected>
              <img src="images/icon_dropdown.svg" alt="??????" />
            </SearchCategory>
            <SearchCategory onClick={() => openModal('??????')}>
              <SearchCategoryName>??????</SearchCategoryName>
              <SearchCategorySelected>
                {location || '??????'}
              </SearchCategorySelected>
              <img src="images/icon_dropdown.svg" alt="??????" />
            </SearchCategory>
            <SearchCategory onClick={() => openModal('?????? ??????')}>
              <SearchCategoryName>?????? ??????</SearchCategoryName>
              <SearchCategorySelected>
                {jobType || '??????'}
              </SearchCategorySelected>
              <img src="images/icon_dropdown.svg" alt="??????" />
            </SearchCategory>
            <SearchCategory onClick={() => openModal('??????')}>
              <SearchCategoryName>??????</SearchCategoryName>
              <SearchCategorySelected>
                {sort}
              </SearchCategorySelected>
              <img src="images/icon_dropdown.svg" alt="??????" />
            </SearchCategory>
          </SearchCategories>
        </Form>
      </Container>
      <CategoryModal
        name="?????? ??????"
        data={jobs}
        setCategory={setJob}
        isOpen={isJobModalOpen}
        closeModal={() => closeModal('??????')}
      />
      <CategoryModal
        name="?????? ??????"
        data={locations}
        setCategory={setLocation}
        isOpen={isLocationModalOpen}
        closeModal={() => closeModal('??????')}
      />
      <CategoryModal
        name="?????? ??????"
        data={jobTypes}
        setCategory={setJobType}
        isOpen={isWorkTypeModalOpen}
        closeModal={() => closeModal('?????? ??????')}
      />
      <CategoryModal
        name="??????"
        data={sorts}
        setCategory={setSort}
        isOpen={isSortModalOpen}
        closeModal={() => closeModal('??????')}
      />
    </>
  );
}

export default Home;
