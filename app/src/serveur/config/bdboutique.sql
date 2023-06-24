--
-- Base de données : `bdboutique`
--
-- Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS bdboutique DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

-- Switch to the database
USE bdboutique;

-- --------------------------------------------------------

CREATE TABLE `connexion` (
  `idcm` int(11) NOT NULL,
  `courriel` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `pass` varchar(12) COLLATE utf8_unicode_ci NOT NULL,
  `role` varchar(1) COLLATE utf8_unicode_ci DEFAULT 'M',
  `statut` varchar(1) COLLATE utf8_unicode_ci DEFAULT 'A'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `connexion`
--

INSERT INTO `connexion` (`idcm`, `courriel`, `pass`, `role`, `statut`) VALUES
(1, 'admin@gpucanada.com', 'admin', 'A', 'A');


-- --------------------------------------------------------

--
-- Structure de la table `membres`
--

CREATE TABLE `membres` (
  `idm` int(11) NOT NULL,
  `nom` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `prenom` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `courriel` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `sexe` varchar(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `datenaissance` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `membres`
--

INSERT INTO `membres` (`idm`, `nom`, `prenom`, `courriel`, `sexe`, `datenaissance`) VALUES
(1, 'Sami', 'Timur', 'admin@gpucanada.com', 'M', '2000-01-01');


--
-- Index pour les tables déchargées
--

-- Index pour la table `membres`
--
ALTER TABLE `membres`
  ADD PRIMARY KEY (`idm`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `membres`
--
ALTER TABLE `membres`
  MODIFY `idm` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;
