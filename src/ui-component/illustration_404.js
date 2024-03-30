// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Illustration_404 = () => {
    const theme = useTheme();

    return (
        <svg width="480" height="360" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 198.781c0 41.457 14.945 79.235 39.539 107.785 28.214 32.765 69.128 53.365 114.734 53.434a148.458 148.458 0 0056.495-11.036c9.051-3.699 19.182-3.274 27.948 1.107a75.774 75.774 0 0033.957 8.011c5.023 0 9.942-.495 14.7-1.434 13.581-2.67 25.94-8.99 36.089-17.94 6.379-5.627 14.548-8.456 22.898-8.446h.142c27.589 0 53.215-8.732 74.492-23.696 19.021-13.36 34.554-31.696 44.904-53.225C474.92 234.581 480 213.388 480 190.958c0-76.931-59.774-139.305-133.498-139.305-7.516 0-14.88.663-22.063 1.899C305.418 21.42 271.355 0 232.498 0a103.647 103.647 0 00-45.879 10.661c-13.24 6.487-25.011 15.705-34.641 26.939-32.697.544-62.93 11.69-87.675 30.291C25.351 97.155 0 144.882 0 198.781z"
                fill={theme.palette.secondary.main}
                opacity=".2"
            />
            <g filter="url(#prefix__filter0_d)">
                <circle opacity=".15" cx="182.109" cy="97.623" r="44.623" fill="#FFC107" />
                <circle cx="182.109" cy="97.623" r="23.406" fill="url(#prefix__paint1_linear)" />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M244.878 306.611c34.56 0 62.575-28.016 62.575-62.575 0-34.56-28.015-62.576-62.575-62.576-34.559 0-62.575 28.016-62.575 62.576 0 34.559 28.016 62.575 62.575 62.575zm0-23.186c21.754 0 39.389-17.635 39.389-39.389 0-21.755-17.635-39.39-39.389-39.39s-39.389 17.635-39.389 39.39c0 21.754 17.635 39.389 39.389 39.389z"
                    fill={theme.palette.primary.main}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M174.965 264.592c0-4.133-1.492-5.625-5.637-5.625h-11.373v-66.611c0-4.476-1.492-5.637-5.638-5.637h-9.172a9.866 9.866 0 00-7.948 3.974l-55.03 68.274a11.006 11.006 0 00-1.957 6.787v5.968c0 4.145 1.492 5.637 5.625 5.637h54.676v21.707c0 4.133 1.492 5.625 5.625 5.625h8.12c4.146 0 5.638-1.492 5.638-5.625v-21.707h11.434c4.414 0 5.637-1.492 5.637-5.637v-7.13zm-72.42-5.625l35.966-44.415v44.415h-35.966zM411.607 264.592c0-4.133-1.492-5.625-5.638-5.625h-11.422v-66.611c0-4.476-1.492-5.637-5.637-5.637h-9.111a9.87 9.87 0 00-7.949 3.974l-55.03 68.274a11.011 11.011 0 00-1.981 6.787v5.968c0 4.145 1.492 5.637 5.626 5.637h54.687v21.707c0 4.133 1.492 5.625 5.626 5.625h8.12c4.145 0 5.637-1.492 5.637-5.625v-21.707h11.434c4.476 0 5.638-1.492 5.638-5.637v-7.13zm-72.42-5.625l35.965-44.415v44.415h-35.965z"
                    fill={theme.palette.secondary.main}
                />
                <path
                    opacity=".24"
                    d="M425.621 117.222a8.267 8.267 0 00-9.599-8.157 11.129 11.129 0 00-9.784-5.87h-.403a13.23 13.23 0 00-20.365-14.078 13.23 13.23 0 00-5.316 14.078h-.403a11.153 11.153 0 100 22.293h38.68v-.073a8.279 8.279 0 007.19-8.193zM104.258 199.045a7.093 7.093 0 00-7.093-7.092c-.381.007-.761.039-1.138.097a9.552 9.552 0 00-8.425-5.026h-.343a11.348 11.348 0 10-22.012 0h-.342a9.564 9.564 0 100 19.114h33.177v-.061a7.107 7.107 0 006.176-7.032z"
                    fill={theme.palette.grey[900]}
                />
            </g>
            <defs>
                <linearGradient id="prefix__paint0_linear" x1="328.81" y1="424.032" x2="505.393" y2="26.048" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2065D1" />
                    <stop offset="1" stopColor="#2065D1" stopOpacity=".01" />
                </linearGradient>
                <linearGradient
                    id="prefix__paint1_linear"
                    x1="135.297"
                    y1="97.623"
                    x2="182.109"
                    y2="144.436"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FFE16A" />
                    <stop offset="1" stopColor="#B78103" />
                </linearGradient>
                <filter
                    id="prefix__filter0_d"
                    x="51"
                    y="49"
                    width="394.621"
                    height="277.611"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dx="8" dy="8" />
                    <feGaussianBlur stdDeviation="6" />
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                    <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
            </defs>
        </svg>
    );
};

export default Illustration_404;
