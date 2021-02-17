import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import { Header, RespositoryInfo, Issues } from './styles';
import logoImg from '../../assets/logo.png';
import { promises } from 'fs';

interface RepositoryParamas {
    repository: string;
}

interface Repository {
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    owner: {
        login: string;
        avatar_url: string;
    }
}

interface Issue {
    id: number;
    title: string;
    html_url: string;
    user: {
        login: string;
    }
}

const Repository: React.FC = () => {
    const { params } = useRouteMatch<RepositoryParamas>();

    //Sempre que for array ou objeto criar uma interface.
    const [ repository, setRepository ] = useState<Repository | null>(null);
    const [ issues, setIssues ] = useState<Issue[]>([]);

    useEffect(() => {
        // api.get(`repos/${params.repository}`).then((response) => {
        //     setRepository(response.data);
        // });

        // api.get(`repos/${params.repository}/issues`).then((response) => {
        //     setIssues(response.data);
        // });

        async function loadData(): Promise<void> {
            const [ repositoryData, issuesData ] = await Promise.all([
                api.get(`repos/${params.repository}`), 
                api.get(`repos/${params.repository}/issues`)
            ]); 

            setRepository(repositoryData.data);
            setIssues(issuesData.data);
        }

        loadData();
        
    }, [params.repository]);

    return (
        <>
            <Header>
                <img src={logoImg} alt="" width="130"/>
                <Link to="/">
                    <FiChevronLeft size={16}/>
                    Voltar
                </Link>
            </Header>
            
            { repository ? (
                <RespositoryInfo>
                <header>
                    <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
                    <div>
                        <strong>{ repository.full_name }</strong>
                        <p>{ repository.description }</p>
                    </div>
                </header>
                <ul>
                    <li>
                        <strong>{ repository.stargazers_count }</strong>
                        <span>Starts</span>
                    </li>
                    <li>
                        <strong>{ repository.forks_count }</strong>
                        <span>Forks</span>
                    </li>
                    <li>
                        <strong>{ repository.open_issues_count }</strong>
                        <span>Issues abertas</span>
                    </li>
                </ul>
            </RespositoryInfo>
            ):(
                <p>Carregando ...</p>
            )}
            
            <Issues>
                {
                    issues.map( issue => (
                        <a href={issue.html_url} key={issue.id}>
                            <div>
                            <strong>{issue.title}</strong>
                            <p>{issue.user.login}</p>
                            </div>
                            <FiChevronRight size={20}/>
                        </a>
                    ))
                }
            </Issues>
        </>
    );
}

export default Repository;