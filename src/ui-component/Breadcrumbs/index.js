import React from 'react';
import { Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const BreadCrumbs = () => {
    const { pathname } = useLocation();
    const pathParts = pathname.split('/').filter((part) => part !== ''); // Tách và loại bỏ các phần trống

    const renderBreadcrumbs = () => {
        let currentPath = '';
        return pathParts.map((part, index) => {
            currentPath += `/${part}`;
            const isLast = index === pathParts.length - 1;
            return (
                <Link key={part} underline="hover" color="inherit" component={RouterLink} to={currentPath}>
                    {part}
                    {!isLast}
                </Link>
            );
        });
    };

    return (
        <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb" separator=">">
                <Link underline="hover" color="inherit" component={RouterLink} to="/">
                    Trang chủ
                </Link>
                {renderBreadcrumbs()}
            </Breadcrumbs>
        </div>
    );
};

export default BreadCrumbs;
