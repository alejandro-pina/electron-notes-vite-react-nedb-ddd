import React from 'react';
import styles from './pagination.module.css';
import IconAngleDoubleLeft from '../atoms/icons/icon-angle-double-left.atoms';
import IconAngleLeft from '../atoms/icons/icon-angle-left.atoms';
import IconEllipsisH from '../atoms/icons/icon-ellipsis.atoms';
import IconAngleDoubleRight from '../atoms/icons/icon-angle-double-right.atoms';
import IconAngleRight from '../atoms/icons/icon-angle-right.atoms';

interface PaginationProps {
	totalItems: number;
	itemsPerPage: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
	totalItems,
	itemsPerPage,
	currentPage,
	onPageChange,
}) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	};

	const renderPageNumbers = () => {
		const pageNumbers = [];

		let startPage = Math.max(1, currentPage - 2);
		let endPage = Math.min(startPage + 4, totalPages);
		
		if (startPage > 1) {
			pageNumbers.push(
				<div key={-2} className={styles.ellipsis}>
					<IconEllipsisH />
				</div> 
			);
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<div key={i} className={styles.page_number}>
					<button
						className={`${styles.pageButton} ${
							i === currentPage ? styles.active : ''
						}`}
						onClick={() => handlePageChange(i)}
					>
						{i}
					</button>
				</div>
			);
		}

		if (endPage < totalPages) {
			pageNumbers.push(
				<div key={-3} className={`${styles.ellipsis_right} ${styles.ellipsis}`}>
					<IconEllipsisH />
				</div>
			);
		}

		return pageNumbers;
	};

	return (
		<div className={styles.paginationContainer}>
			<div className={styles.number_container}>
				<div className={styles.page_number}>
					<button
						className={`${styles.arrowButton} ${
							currentPage === 1 ? styles.disabled : ''
						}`}
						onClick={() => handlePageChange(1)}
						disabled={currentPage === 1}
					>
						<IconAngleDoubleLeft />
					</button>
				</div>
				<div className={styles.page_number}>
					<button
						className={`${styles.arrowButton} ${
							currentPage === 1 ? styles.disabled : ''
						}`}
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						<IconAngleLeft />
					</button>
				</div>
				{renderPageNumbers()}
			</div>
			<div className={styles.number_container}>
				<div className={styles.page_number}>
					<button
						className={`${styles.arrowButton} ${
							currentPage === totalPages ? styles.disabled : ''
						}`}
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						<IconAngleRight />
					</button>
				</div>
				<div className={styles.page_number}>
					<button
						className={`${styles.arrowButton} ${
							currentPage === totalPages ? styles.disabled : ''
						}`}
						onClick={() => handlePageChange(totalPages)}
						disabled={currentPage === totalPages}
					>
						<IconAngleDoubleRight />
					</button>
				</div>
			</div>
			<div className={styles.itemsContainer}>
				<div className={styles.totalItems}>{totalItems}</div>
			</div>
		</div>
	);
};

export default Pagination;
