-- otp_database_dev.jwt_issued definition
CREATE TABLE
  `jwt_issued` (
    `id` int (11) NOT NULL AUTO_INCREMENT,
    `jti` varchar(255) NOT NULL,
    `userId` int (11) NOT NULL,
    `issuedAt` timestamp NOT NULL,
    `expiresAt` timestamp NOT NULL,
    `revokedAt` timestamp NULL DEFAULT NULL,
    `isRevoked` tinyint (4) NOT NULL DEFAULT 0,
    `type` enum ('ACCESS', 'REFRESH') NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `IDX_c6eaf707ff28cd892d6c178df2` (`jti`),
    KEY `FK_25b91790f9ad429ed2b2ba54507` (`userId`),
    CONSTRAINT `FK_25b91790f9ad429ed2b2ba54507` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

  -- otp_database_dev.users definition

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
`username` varchar(255) NOT NULL,
`password` varchar(255) NOT NULL,
`email` varchar(255) NOT NULL,
`permission` enum('MEMBER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'MEMBER',
`createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
`updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON
UPDATE
    current_timestamp(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`),
    UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
