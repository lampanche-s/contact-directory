CREATE TABLE admin_users (
    id UUID PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ADMIN',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at TIMESTAMPTZ NULL
);

CREATE TABLE contacts (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sector VARCHAR(120) NOT NULL,
    extension VARCHAR(30) NOT NULL,
    email VARCHAR(180) NULL,
    phone VARCHAR(30) NULL,
    phone_digits VARCHAR(20) NULL,
    photo_path VARCHAR(500) NULL,
    photo_content_type VARCHAR(80) NULL,
    photo_size_bytes BIGINT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_contacts_active_name ON contacts(active, name);
CREATE INDEX idx_contacts_active_sector ON contacts(active, sector);
CREATE INDEX idx_contacts_extension ON contacts(extension);
CREATE INDEX idx_contacts_updated_at ON contacts(updated_at DESC);
