import PropTypes from 'prop-types';
import css from './SearchBar.module.css';

const SearchBar = props => {
  const handleSubmit = e => {
    e.preventDefault();
    const form = e.currentTarget;
    const query = form.elements.query.value;
    props.onSubmit({ query });
  };

  return (
    <header className={css['search-bar']}>
      <form className={css.form} onSubmit={handleSubmit}>
        <button type="submit" className={css.button}>
          <span className={css['button-label']}>Search</span>
        </button>

        <input
          name="query"
          className={css.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
